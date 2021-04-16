const db = require('../services/db');

export const findAll = async(): Promise<any> => {
    const rows = await db.pool.query('SELECT * FROM tankshelf.freshwater_fish');
    return rows[0];
}