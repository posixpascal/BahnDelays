import { Train } from './train';
import { load } from 'cheerio';
import * as request from 'request';
import * as moment from 'moment';

/**
 * 
 * 
 * @export
 * @class WebAPI
 */
export class WebAPI {
    /**
     * The base URL to retrieve delayed trains
     * 
     * @static
     * 
     * @memberOf WebAPI
     */
    static BASE_URL = "http://rabdc.bahn.de/bin/bhftafel.exe/dn?ld=3756&rt=1&"
    /**
     * The specific date format required by the API
     * 
     * @static
     * 
     * @memberOf WebAPI
     */
    static BAHN_DATE_FORMAT = "D.M.Y";
    /**
     * The specific time format required by the API
     * 
     * @static
     * 
     * @memberOf WebAPI
     */
    static BAHN_TIME_FORMAT = "HH:mm";

    /**
     * Returns a list of start and endpoints for this train,
     * the first item is the station where the train was started,
     * the last item is the last station the train will visit in its journey.
     * 
     * @static
     * @param {Train} train The train you want to lookup
     * @returns {Promise<Array<any>>} An array of start and endpoints
     * 
     * @memberOf WebAPI
     */
    static getJourneyInfo(train: Train): Promise<Array<any>> { 
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

    /**
     * Gets a list of trains which are about to leave this station
     * 
     * @static
     * @param {TrainStation} station The trainstation you want to check
     * @param {*} [opts={}] Options for finer results. The object may contain the following keys:
     *            (trainName = <yourTrainId>)
     * @returns {Promise<any>} A list of trains
     * 
     * @memberOf WebAPI
     */
    static getStationInfo(station: TrainStation, opts: any = {}): Promise<any> {
        const currentDate = new Date();
        return new Promise((resolve, reject) => {
            // send request to API
            request.post(WebAPI.BASE_URL, {
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
                // filter HTML
                const $ = load(body);
                const departureTable = $("table.result.stboard.dep");
                const trainsData = departureTable.find("[id^='journey']");
                const trains = [];
                // parse trains
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

    /**
     * Returns a german shortname for the current day
     * 
     * @static
     * @returns
     * 
     * @memberOf WebAPI
     */
    static getDayName() {
        return ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][parseInt(moment().format("e"), 10)]
    }

    /**
     * Formats the server response for delays
     * 
     * @static
     * @param {string} body The server response
     * @returns {Object} An object containing delay information and reasons.
     * 
     * @memberOf WebAPI
     */
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