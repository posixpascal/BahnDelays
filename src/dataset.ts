import {Train} from './train';

export class DataSet {
    public static CACHED_TRAINS : JSON;
    static getTrains() : JSON {
        if (!DataSet.CACHED_TRAINS){
            DataSet.CACHED_TRAINS = require('../../dataset/trains.json').map((payload) => {
                return new Train(payload);
            });
        }
        return DataSet.CACHED_TRAINS;
    }
}