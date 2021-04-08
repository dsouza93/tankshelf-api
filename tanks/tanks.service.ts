import { stringify } from 'querystring';
import { BaseTank, Tank, TankKeys } from './tank.interface';
import { Tanks } from './tanks.interface';
import { escape, QueryError } from 'mysql2';
import { v4 as uuid } from 'uuid';
import PoolConnection from 'mysql2/typings/mysql/lib/PoolConnection';
import Pool from 'mysql2/typings/mysql/lib/Pool';
import { resolve } from 'node:path';
import { addImage, moveToUploads }  from '../media/media.service';
import { FormFields, tanksRouter } from './tanks.router';
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
    const rows = await db.pool.query("SELECT t.tankID, name, description, type, image, stream, age, imageID, url FROM tankshelf.tanks t INNER JOIN tankshelf.images i ON t.image = i.imageID");
    return rows[0];
}
// Find single by id tank service
export const find = async(id: number): Promise<Tank> => {
    const rows = await db.pool.query("SELECT tankID, name, description, type, age FROM tanks WHERE tankID = ?", [id]);
    return rows[0][0];
}
// Create Tank Service
export const create = async(newTank: BaseTank, images: FormFields["images"]): Promise<any> => {
    console.log('tanks.service create()');
    let tankID;
    const uploadImages = Object.keys(images);
    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();

        const tankResult = await connection.query("INSERT INTO tanks (name, description, type, image, stream, age) VALUES (?, ?, ?, ?, ?, ?)",
            [newTank.name, newTank.description, newTank.type, newTank.image, newTank.stream, newTank.age]);
        
        tankID = tankResult[0].insertId;
        console.log('tankID: ', tankID);

        for (const [index, image] of uploadImages.entries()) {          
            moveToUploads(tankID, images[image]);
            const imgUpload = await connection.query("INSERT INTO images (tankID, url) VALUES (?, ?)", 
                [tankID, `${process.env.IMG_DIRECTORY}/${tankID}/${image}`])
            
            const imgID = imgUpload[0].insertId;
            // Update tank to set default image to first image
            if (index === 0) {
                const defaultImgResult = connection.query("UPDATE tanks SET image = ? WHERE tankID = ?", [imgID, tankID])
            }
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

    const query = await db.pool.query(`UPDATE tanks SET ${escapedProps} WHERE tankID = ${id}`);

    const updatedTank = await find(id);

    return updatedTank;

}

export const remove = async(id: number): Promise<null | void> => {
    const tank = await find(id);

    if(!tank) {
        return null;
    }

    const result = await db.pool.query("DELETE FROM tanks WHERE tankID = ?", [id])
}