import { Tanks } from '../tanks/tanks.interface';
import { BaseTank, Tank } from '../tanks/tank.interface';
import { config } from '../config';
import { Connection, MysqlError } from 'mysql';
const mysql = require('mysql');

const pool = mysql.createPool({
    host: config.db.HOST,
    user: config.db.USER,
    password: config.db.PASSWORD,
    database: config.db.DATABASE,
    multipleStatements: true
});

async function query(sql: string): Promise<Tank[]> {
    var results;
    const connection = await pool.getConnection((err: MysqlError, connection: Connection) => {
            if (err) throw err;
            console.log(`connected as ${connection.threadId}`);

            results = connection.query(sql, (err, results, fields) => {
                connection.release();
                if(err) throw err;
                console.log(results)
                return results;
            });
        });

    // const [results, ] = await connection.query(sql, (err, results, fields) => {
    //         connection.release();
    //         if(err) throw err;
    //         return results;
    // });
    // console.log(results);

    return results;
}

module.exports = {
    query
}