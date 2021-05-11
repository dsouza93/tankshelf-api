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
import Formidable from 'formidable';
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
    const rows = await db.pool.query("SELECT tankID, name, description, type, age, BIN_TO_UUID(userID) as userID FROM tanks WHERE tankID = ?", [id]);
    return rows[0][0];
}
// Create Tank Service
export const create = async(newTank: Tank, userID: string): Promise<any> => {
    console.log('tanks.service create()');
    let tankID;
    // Pull out images to add to image tables
    const uploadImages = Object.keys(newTank.images);
    // Pull out inhabitants contents
    const inhabitants = newTank.inhabitants;
    // Pull out plant contents
    const plants = newTank.plants;

    // Get Pool connection from DB for a SQL transaction
    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();

        // Create tank first so we have a tankID to relate images and contents to
        const tankResult = await connection.query("INSERT INTO tanks (name, description, type, image, stream, age, userID) VALUES (?, ?, ?, ?, ?, ?, UUID_TO_BIN(?))",
            [newTank.name, newTank.description, newTank.type, newTank.image, newTank.stream, newTank.age, userID]);
        
        tankID = tankResult[0].insertId;
        
        
        // Create relation between tank and it's inhabitant contents
        // console.log(inhabitants);
        // console.log(plants)
        for (let i=0; i < inhabitants.length; i++) {
            const res = await connection.query("INSERT INTO tankshelf.tank_contents_fish (tankID, fishID) VALUES (?, ?)",
                [tankID, inhabitants[i].fishID]);
            console.log(res);
        }

        // Create relation between tank and it's plant contents
        for (let i=0; i < plants.length; i++) {
            const res = await connection.query("INSERT INTO tankshelf.tank_contents_plants (tankID, plantID) VALUES (?, ?)",
                [tankID, plants[i].plantID]);
            console.log(res);
        }

        for (const [index, image] of uploadImages.entries()) {    
            const img = newTank.images[image] as Formidable.File
            moveToUploads(tankID, img);
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
export const update = async(id: number, tankUpdate: BaseTank): Promise<Tank | null> => {
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