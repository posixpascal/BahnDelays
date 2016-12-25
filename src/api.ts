import * as request from 'request';

export class OpenREST {
    public static ENDPOINT: string = "https://open-api.bahn.de/bin/rest.exe";

    static queryStations(query: QueryStation): Promise<LocationResult> {
        return new Promise((resolve, reject) => {
            request.get(`${OpenREST.ENDPOINT}/location.name?${OpenREST.toQueryString(query)}`,
                (err, response, body) => {
                    if (err) { return reject(err); }
                    return resolve(body);
                });
        });
    }

    static depatureBoard(boardQuery: QueryDepatureBoard): Promise<any> {
        return new Promise((resolve, reject) => {
            request.get(`${OpenREST.ENDPOINT}/departureBoard?${OpenREST.toQueryString(boardQuery)}`,
                (err, res, body) => {
                    if (err) { return reject(err); }
                    return resolve(body);
                });
        });
    }

    static toQueryString(query: QueryStation|QueryDepatureBoard): string {
        let qs = [];
        Object.keys(query).forEach((key) => {
            qs.push(`${key}=${query[key]}`);
        });
        return qs.join("&");
    }
}