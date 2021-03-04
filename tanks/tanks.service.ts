import { stringify } from 'querystring';
import { BaseTank, Tank, TankKeys } from './tank.interface';
import { Tanks } from './tanks.interface';
import { escape } from 'mysql2';
const db = require('../services/db');


function updatedProps(tankUpdate: BaseTank) {
    const updatedProps: Array<string> = [];

    Object.entries(tankUpdate).forEach(entry => {
            updatedProps.push(`${escape(entry[0])} = "${escape(entry[1])}"`);
    });

    return updatedProps;
}

// Find all tanks service
export const findAll = async(): Promise<Tanks> => {
    const rows = await db.pool.query("SELECT id, name, description, waterType, image, stream FROM tanks");
    return rows[0];
}
// Find single by id tank service
export const find = async(id:number): Promise<Tank> => {
    const rows = await db.pool.query("SELECT * FROM tanks WHERE id = ?", [id]);
    return rows[0][0];
}
// Create Tank Service
export const create = async(newTank: BaseTank): Promise<Tank | null> => {
    const id = new Date().valueOf();
    
    const result = await db.pool.query("INSERT INTO tanks (id, name, description, waterType, image, stream, age) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, newTank.name, newTank.description, newTank.waterType, newTank.image, newTank.stream, newTank.age]);
    
    if(result[0].affectedRows === 1) {
        const newTank = await find(id);
        return newTank;
    } else {
        return null;
    }
}
// Update tank service
export const update = async(id: number, tankUpdate: BaseTank): Promise<Tank | null> => {
    const tank = await find(id);

    if(!tank) {
        return null;
    }
    const escapedProps = updatedProps(tankUpdate);

    const query = await db.pool.query(`UPDATE tanks SET ${escapedProps} WHERE id = ${id}`);

    const updatedTank = await find(id);

    return updatedTank;

}

export const remove = async(id: number): Promise<null | void> => {
    const tank = await find(id);

    if(!tank) {
        return null;
    }

    const result = await db.pool.query("DELETE FROM tanks WHERE id = ?", [id])
}