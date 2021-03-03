import { Tanks } from '../tanks/tanks.interface';
import { BaseTank, Tank } from '../tanks/tank.interface';
import { config } from '../config';
import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection';
import { Pool, Query, RowDataPacket } from 'mysql2/promise';
const mysql = require('mysql2');

const pool: Pool = mysql.createPool({
    host: config.db.HOST,
    user: config.db.USER,
    password: config.db.PASSWORD,
    database: config.db.DATABASE,
    multipleStatements: true
}).promise();

async function query(sql: string) {
    const results = await pool.query(sql);
    return results;
}

module.exports = {
    pool
}