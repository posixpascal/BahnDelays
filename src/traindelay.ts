import * as Twit from 'twit';
import * as request from 'request';
import * as moment from 'moment';
import { Stations } from './trainstations';
import { WebAPI } from './webapi';
import { Utils } from './utils';
import { Train } from './train';
import { load } from 'cheerio'
import { Database } from './database';


/**
 * The core application wrapper
 * 
 * @export
 * @class TrainDelay
 */
export class TrainDelay {
    static DEBUG = false;
    static MIN_DELAY_TIME = 5;

    /**
     * An instance of the Twitter API
     * 
     * @type {Twit}
     * @memberOf TrainDelay
     */
    public twitter: Twit;

    /**
     * Queued trains which will be published to twitter in a set interval
     * @type {Train[]}
     * @memberOf TrainDelay
     */
    public trainQueue: Train[] = [];
    public nonDelayedTrainQueue: Train[] = [];
    /**
     * The total amount of delay time in minutes
     * 
     * @type {number}
     * @memberOf TrainDelay
     */

    public totalDelay: number;
    /**
     * The date where the script was started
     * 
     * @type {Date}
     * @memberOf TrainDelay
     */
    public startDate: Date;

    /**
     * Starts the TrainDelay application, connects to twitter and starts to handle the queue.
     * 
     * @memberOf TrainDelay
     */
    start() {
        this.startDate = new Date();
        this.twitter = new Twit({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token: process.env.ACCESS_TOKEN,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,
            timeout_ms: 60 * 1000
        });

        TrainDelay.DEBUG = process.env.DEBUG || false;
        TrainDelay.MIN_DELAY_TIME = process.env.MIN_DELAY_TIME || false;
        this.handleQueue();
        setInterval(() => {
            this.handleQueue();
        }, 30 * 1000);
    }


    /**
     * Fetch a list of trains from the dataset and check each train's departureboard
     * 
     * @returns void
     * @memberOf TrainDelay
     */
    collectTrains() {
        Stations.getAll().then((stations) => {
            let delay = 0;
            Utils.group(stations, 4).forEach((stationGroup) => {
                setTimeout((stationGroup) => {
                    stationGroup.forEach((station) => {
                        WebAPI.getStationInfo(station).then((trains) => {
                            trains.forEach((train) => {
                                Database.insertTrain(train);
                                if (train.information.delayed) {
                                    if (TrainDelay.DEBUG) {
                                        console.log("Pushed train to queue since its delayed");
                                    }
                                    this.trainQueue.push(train);
                                } else {
                                    this.nonDelayedTrainQueue.push(train);
                                    if (TrainDelay.DEBUG) {
                                        console.log("Train not pushed to queue since not delayed");
                                    }
                                    return;
                                }
                            })
                        });
                    });
                }, delay++ * (1000), stationGroup);
            });
        });
    }

    resetQueue() {
        this.trainQueue = [];
        let endDate = new Date();
        if (this.totalDelay) {
            this.twitter.post('statuses/update', {
                status: `Zwischenstand: ${this.totalDelay} Minuten Verspätung zwischen ${moment(this.startDate).format("H:m")} und ${moment(endDate).format("H:m")}`
            });
        }
        this.collectTrains();
        return;
    }
    /**
     * Pops an item from the stack and publishes it to twitter,
     * if no item is present it tries to fetch new trains from bahn.de
     * 
     * @returns void
     * @memberOf TrainDelay
     */
    handleQueue() {
        const train = this.trainQueue.shift();

        if (!train) {
            this.resetQueue();
            return;
        }

        if ((+new Date()) - (+this.startDate) > 1000 * 60 * 15) {
            this.resetQueue();
            return;
        }

        console.log(`Picking train ${train.trainName} / Queue Size: ${this.trainQueue.length}`);

        WebAPI.getJourneyInfo(train).then((journal) => {
            if (parseInt(train.information.delayedTime, 10) >= TrainDelay.MIN_DELAY_TIME) {
                const tweet = `Der Zug (${train.trainName}) von '${journal[0].station}' nach '${journal[journal.length - 1].station}' hat eine #Verspätung von ${train.information.delayedTime}m @db_bahn #DBVerspätung`;
                this.totalDelay += train.information.delayedTime;
                if (TrainDelay.DEBUG) {
                    console.log("Tweeting: ", tweet);
                }
                this.twitter.post('statuses/update', {
                    status: tweet
                });
            }
        });
    }
}

