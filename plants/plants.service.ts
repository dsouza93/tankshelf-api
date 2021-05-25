const db = require('../services/db');

export const findAll = async(): Promise<any> => {
    const rows = await db.pool.query('SELECT plantID as id, name, common_name, url FROM tankshelf.freshwater_plants');
    return rows[0];
}

// find plants owned by tankID
export const findByTankID = async(tankID: number): Promise<any> => {
    const rows = await db.pool.query('SELECT fp.plantID as id, fp.common_name, fp.name, fp.url FROM tankshelf.tank_contents_plants tcp JOIN tankshelf.freshwater_plants fp ON tcp.plantID = fp.plantID WHERE tcp.tankID = ?',
        [tankID]);
        
    return rows[0];
}