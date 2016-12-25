import { Train } from './train';
import { load } from 'cheerio';
import { post } from 'request';
import * as moment from 'moment';

export class WebAPI {
    static BASE_URL = "http://rabdc.bahn.de/bin/bhftafel.exe/dn?ld=3756&rt=1&"
    static BAHN_DATE_FORMAT = "D.M.Y";
    static BAHN_TIME_FORMAT = "HH:mm";

    static getJourneyInfo(train: Train): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    static getStationInfo(station: TrainStation, opts: any = {}): Promise<any> {
        const currentDate = new Date();
        return new Promise((resolve, reject) => {
            post(WebAPI.BASE_URL, {
                form: {
                    input: station.station,
                    date: `${WebAPI.getDayName()}, ${moment().format(WebAPI.BAHN_DATE_FORMAT)}`,
                    time: moment().format(WebAPI.BAHN_TIME_FORMAT),
                    boardType: 'dep',
                    REQTrain_name: opts.trainName || "",
                    advancedProductMode: "",
                    GUIREQProduct_0: "on",
                    GUIREQProduct_1: "on",
                    GUIREQProduct_2: "on",
                    GUIREQProduct_3: "on",
                    GUIREQProduct_4: "on",
                    start: "Suchen"
                }
            }, (err, res, body) => {
                const $ = load(body);
                const departureTable = $("table.result.stboard.dep");
                const trainsData = departureTable.find("[id^='journey']");
                const trains = [];
                for (let i = 0, len = trainsData.length; i < len; i++) {
                    let trainData = trainsData.eq(i);
                    let train = {
                        journeyURL: `http://rabdc.bahn.de/${trainData.find(".train").last().find("a").attr("href")}`,
                        trainName: trainData.find(".train").last().text().trim().replace(" ", "").replace("\t", ""),
                        information: WebAPI.delayFormat(trainData.find(".ris span").text())
                    }

                    if (train.information.delayed){
                        trains.push(train);
                    }
                }
                resolve(trains);
            });
        });
    }

    static getDayName() {
        return ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][parseInt(moment().format("e"), 10)]
    }

    static delayFormat(body: string) {
        let delay = 0;
        const matches = body.match(/\+(\d+)/);
        if (matches && matches.length >= 2) {
            delay = parseInt(matches[1], 10);
        }
        body = body.replace(`+${delay}`, '');
        return {
            delayedTime: delay,
            delayed: delay > 0,
            reason: body != '' ? body : -1
        }

    }


}