export class TrainStation  implements TrainStation {
    public name : string;
    public station : string;
    public id : number;
    public location : string;
    public country : string;
    public postalcode : string;
    public reason : string;
    public city : string;
    public street : string;
    
    constructor(payload: TrainStation) {
        [
            "name",
            "station",
            "id",
            "location",
            "city",
            "country",
            "street",
            "postalcode",
            "reason"
        ].forEach((field) => {
            this[field] = payload[field];
        });
    }
}