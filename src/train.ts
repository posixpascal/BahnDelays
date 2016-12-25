export class Train {
    public id : string;
    public from : string;
    public to : string;
    public trainName : string;
    public type : string;
    public information? : any;
    constructor(payload : JSON){
        [
            "id", "from", "to", "type"
        ].forEach((field) => { this[field] = payload[field]; });
    }
}