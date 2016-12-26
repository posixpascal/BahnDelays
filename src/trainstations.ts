import { TrainStation } from './trainstation';
import * as csv from 'csv-parser';
import * as fs from 'fs';

/**
 * 
 * 
 * @export
 * @class Stations
 */
export class Stations {
    /**
     * The source of train stations provided by Deutsche Bahn GmbH (opendata bahn)
     * 
     * @static
     * 
     * @memberOf Stations
     */
    public static DATASET = "dataset/stationdata.csv";
    /**
     * Cached TrainStations for later retrival
     * 
     * @static
     * @type {TrainStation[]}
     * @memberOf Stations
     */
    public static CACHED: TrainStation[] = [];

    /**
     * Parses the given DATASET and transforms it into an array of TrainStations
     * 
     * @static
     * @returns {Promise<TrainStation[]>} The transformed TrainStations
     * 
     * @memberOf Stations
     */
    static getAll(): Promise<TrainStation[]> {
        let stations = [];
        return new Promise((resolve, reject) => {
            if (!Stations.CACHED.length) { // cache miss
                fs.createReadStream(Stations.DATASET)
                    .pipe(csv({
                        separator: ';',
                        headers: TrainStation.FIELDS
                    }))
                    .on('data', (data) => {
                        stations.push(new TrainStation(data));
                    }).on('end', () => {
                        Stations.CACHED = stations;
                        resolve(stations);
                    })
            } else {
                resolve(Stations.CACHED);
            }
        });
    }
}