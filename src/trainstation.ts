
/**
 * A data class for train stations
 * 
 * @export
 * @class TrainStation
 * @implements {TrainStation}
 */
export class TrainStation  implements TrainStation {
    static FIELDS = [
                            "country",
                            "city",
                            "id",
                            "station",
                            "name",
                            "rid",
                            "street",
                            "postalcode",
                            "location",
                            "reason"
                        ];
    /**
     * The station shortcut name provided by bahn.de
     * 
     * @type {string}
     * @memberOf TrainStation
     */
    public name : string;

    /**
     * The station name provided by bahn.de
     * 
     * @type {string}
     * @memberOf TrainStation
     */
    public station : string;
    /**
     * The unique station ID
     * 
     * @type {number}
     * @memberOf TrainStation
     */
    public id : number;
    /**
     * 
     * @type {string}
     * @memberOf TrainStation
     */
    public location : string;
    /**
     * The location
     * 
     * @type {string}
     * @memberOf TrainStation
     */
    public country : string;
    /**
     * The postalcode
     * 
     * @type {string}
     * @memberOf TrainStation
     */
    public postalcode : string;
    /**
     * The city
     * 
     * @type {string}
     * @memberOf TrainStation
     */
    public city : string;
    /**
     * The street
     * 
     * @type {string}
     * @memberOf TrainStation
     */
    public street : string;
    
    /**
     * Creates an instance of TrainStation.
     * 
     * @param {TrainStation} payload
     * 
     * @memberOf TrainStation
     */
    constructor(payload: TrainStation) {
        TrainStation.FIELDS.forEach((field) => {
            this[field] = payload[field];
        });
    }
}