const db = require('../services/db');

export const findAll = async(): Promise<any> => {
    const rows = await db.pool.query('SELECT * FROM tankshelf.freshwater_plants');
    return rows[0];
}

// find plants owned by tankID
export const findByTankID = async(tankID: number): Promise<any> => {
    const rows = await db.pool.query('SELECT fp.* FROM tankshelf.tank_contents_plants tcp JOIN tankshelf.freshwater_plants fp ON tcp.plantID = fp.plantID WHERE tcp.tankID = ?',
        [tankID]);
        
    return rows[0];
}