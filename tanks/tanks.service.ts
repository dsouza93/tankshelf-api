import { BaseTank, Tank } from './tank.interface';
import { Tanks } from './tanks.interface';
const db = require('../services/db');

export const findAll = async(): Promise<Tanks> => {
    const rows = await db.query("SELECT * FROM tanks");

    return rows;
}