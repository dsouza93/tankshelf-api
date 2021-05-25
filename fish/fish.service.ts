const db = require('../services/db');

export const findAll = async(): Promise<any> => {
    const rows = await db.pool.query('SELECT fishID as id, common_name, name, url FROM tankshelf.freshwater_fish');
    return rows[0];
}

// find fish owned by tankID
export const findByTankID = async(tankID: number): Promise<any> => {
    const rows = await db.pool.query('SELECT ff.fishID as id, ff.common_name, ff.name, ff.url FROM tankshelf.tank_contents_fish tcf JOIN tankshelf.freshwater_fish ff ON tcf.fishID = ff.fishID WHERE tcf.tankID = ?;',
        [tankID]);
        
    return rows[0];
}