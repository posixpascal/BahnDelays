import { TrainStation } from './trainstation';
import * as csv from 'csv-parser';
import * as fs from 'fs';

export class Stations {
    public static DATASET = "dataset/stationdata.csv";
    public static CACHED: TrainStation[] = [];

    static getAll(): Promise<TrainStation[]> {
        let stations = [];
        return new Promise((resolve, reject) => {
            if (!Stations.CACHED.length) { // cache miss
                fs.createReadStream(Stations.DATASET)
                    .pipe(csv({
                        separator: ';',
                        headers: [
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
                        ]
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