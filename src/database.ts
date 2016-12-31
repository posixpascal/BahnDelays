import { Train } from './train';
import * as mysql from 'mysql';
import * as dotenv from 'dotenv'; dotenv.config();

export class Database {
    static connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    static insertTrain(train: Train) {
        Database.connection.query(`
            SELECT COUNT(*) FROM trains WHERE \`trains\`.name LIKE ?;
        `, [train.trainName], (err, res) => {
                const count : number = res[0]['COUNT(*)'];
                if (count == 0)
                {    Database.connection.query(`
                    INSERT INTO trains (name)
                    VALUES
                    (?);
                `, [train.trainName]);
                }
        });
    }
}


