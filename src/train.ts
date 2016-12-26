/**
 * Dataset class for trains
 */
/**
 * 
 * 
 * @export
 * @class Train
 */
export class Train {
    /**
     * The train's ID
     * 
     * @type {string}
     * @memberOf Train
     */
    public id : string;

    /**
     * The trains departure
     * 
     * @type {string}
     * @memberOf Train
     */
    public from : string;

    /**
     * The trains destination
     * 
     * @type {string}
     * @memberOf Train
     */
    public to : string;
    /**
     * The trains name
     * 
     * @type {string}
     * @memberOf Train
     */
    public trainName : string;
    /**
     * The type of train (ICE, S, RB)
     * 
     * @type {string}
     * @memberOf Train
     */
    public type : string;

    /**
     * The meta data URL for the train
     * 
     * @type {string}
     * @memberOf Train
     */
    public journeyURL : string;

    /**
     * The specific meta data once retrieved.
     * 
     * @type {*}
     * @memberOf Train
     */
    public information? : any;
    
    /**
     * Creates an instance of Train.
     * 
     * @param {JSON} payload
     * 
     * @memberOf Train
     */
    constructor(payload : JSON){
        [
            "id", "from", "to", "type"
        ].forEach((field) => { this[field] = payload[field]; });
    }
}