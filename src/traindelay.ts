import * as Twit from 'twit';
import * as Table from 'cli-table';
import * as request from 'request';
import * as moment from 'moment';
import { OpenREST } from './api';
import { Stations } from './trainstations';
import { WebAPI } from './webapi';
import { DataSet } from './dataset';
import { Stations } from './trainstations';
import { Utils } from './utils';
import { Train } from './train';
import { load } from 'cheerio'



export class TrainDelay {
    public twitter: Twit;
    public trainQueue: Train[] = [];
    public totalDelay: number;
    public startDate: Date;
    start() {
        this.startDate = new Date();
        this.twitter = new Twit({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token: process.env.ACCESS_TOKEN,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,
            timeout_ms: 60 * 1000
        });



        setInterval(() => {
            this.handleQueue();
        }, 60 * 1000);
    }

    collectTrains() {
        let trains: any = DataSet.getTrains();
        let stations: any = Stations.getAll().then((stations) => {
            let delay = 0;
            Utils.group(stations, 80).forEach((stationGroup) => {
                setTimeout((stationGroup) => {
                    stationGroup.forEach((station) => {
                        WebAPI.getStationInfo(station).then((trains) => {
                            trains.forEach((train) => {
                                if (train.information.delayed) {
                                    this.trainQueue.push(train);
                                } else {
                                    return 0;
                                }
                            });
                        });
                    });
                }, delay++ * 20000, stationGroup);
            });
        });
    }

    handleQueue() {
        const train = this.trainQueue.shift();
        if (!train) {
            let endDate = new Date();
            if (this.totalDelay) {
                this.twitter.post('statuses/update', {
                    status: `Zwischenstand: ${this.totalDelay} Minuten Verspätung zwischen ${moment(this.startDate).format("H:m")} und ${moment(endDate).format("H:m")}`
                });
            }
            this.collectTrains();
            return;
        }
        this.getTrainJournal(train).then((journal) => {
            this.totalDelay += train.information.delayedTime;
            this.twitter.post('statuses/update', {
                status: `Der Zug (${train.trainName}) von '${journal[0].station}' nach '${journal[journal.length - 1].station}' hat eine Verspätung von ${train.information.delayedTime}m @db_bahn`
            });
            console.log(`Der Zug (${train.trainName}) von '${journal[0].station}' nach '${journal[journal.length - 1].station}' hat eine Verspätung von ${train.information.delayedTime}m @db_bahn`);
        });
    }

    getTrainJournal(train): Promise<Array<any>> {
        const trainJournal = [];
        return new Promise((resolve, reject) => {
            request(train.journeyURL, (err, res, body) => {
                const $ = load(body);
                const table = $("table.result.stboard.train");
                const tableRows = table.find("tr")
                for (let i = 1, len = tableRows.length; i < len; i++) {
                    const tableRow = tableRows.eq(i);
                    if (tableRow.hasClass("current")) { continue; }

                    trainJournal.push({
                        station: tableRow.find(".station").text().trim(),
                        arrival: tableRow.find(".arrival").text().trim(),
                        departure: tableRow.find(".departure").text().trim(),
                        platform: tableRow.find(".platform").text().trim()
                    });
                }
                resolve(trainJournal);
            });
        });
    }
}

