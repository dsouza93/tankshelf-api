import { stringify } from 'querystring';
import { BaseTank, Tank, TankKeys } from './tank.interface';
import { Tanks } from './tanks.interface';
import { escape, QueryError } from 'mysql2';
import { v4 as uuid } from 'uuid';
import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection';
import Pool from 'mysql2/typings/mysql/lib/Pool';
import { resolve } from 'node:path';
import { addImage, moveToUploads }  from '../media/media.service';
import { FormFields } from './tanks.router';
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
    const rows = await db.pool.query("SELECT BIN_TO_UUID(id) as id, name, description, type, image, stream FROM tanks");
    return rows[0];
}
// Find single by id tank service
export const find = async(id: string): Promise<Tank> => {
    const rows = await db.pool.query("SELECT BIN_TO_UUID(id) as id, name, description, type, age FROM tanks WHERE id = UUID_TO_BIN(?)", [id]);
    return rows[0][0];
}
// Create Tank Service
export const create = async(newTank: BaseTank, images: FormFields["images"]): Promise<any> => {
    // const id = uuid();
    console.log('tanks.service create()');
    // console.log(newTank);
    
    let tankID;

    const uploadImages = Object.keys(images);

    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();
        const queryResult = await connection.query('SELECT UUID()');
        console.log(queryResult[0][0]['UUID()']);
        tankID = queryResult[0][0]['UUID()'];

        const tankResult = await connection.query("INSERT INTO tanks (id, name, description, type, image, stream, age) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)",
            [tankID, newTank.name, newTank.description, newTank.type, newTank.image, newTank.stream, newTank.age]);

        for (const image of uploadImages) {
            // console.log(images[image]);
            moveToUploads(tankID, images[image]);
            const imgUpload = await connection.query("INSERT INTO images (id, tankID, url) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?)", 
                [tankID, `${process.env.IMG_DIRECTORY}/${tankID}/${image}`])
        }

        // Commit transaction
        await connection.commit();

    } catch (e) {
        console.log('An error occured: ')
        console.error(e);
        connection.rollback();
    } finally {
        connection.release();
    }

    const tank = await find(tankID);
    return tank;
}

// Update tank service
export const update = async(id: string, tankUpdate: BaseTank): Promise<Tank | null> => {
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