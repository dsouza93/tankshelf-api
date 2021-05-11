import { File } from 'formidable';
import * as fs from 'fs';
const db = require('../services/db');

interface Image {
    id: string;
    name: string;
    url: string;
}

// Add image location and associated tank ID to database
export const addImage = async(tankID: string, url: string): Promise<boolean> => {
    const result = await db.pool.query("INSERT INTO tankshelf.images (tankID, url) VALUES (?, ?)", [tankID, url]);
    if (result[0].affectedRows > 0) {
        return true;
    }
    return false;
}

export const findImages = async(tankID: number): Promise<any[]> => {
    const result = await db.pool.query("SELECT url, imageID FROM tankshelf.images WHERE tankID = ?", [tankID]);
    console.log(result[0][0].url);

    return result[0];
}

// Moves image from tmp dir to IMG_DIRECTORY and renames with the filename, returns URL location of image on the filesystem
export const moveToUploads = async(tankID: string, file: File) => {

    // Check if tankID directory already existsm synchronous because uploads are dependent on dir existing
    if (!fs.existsSync(`${process.env.IMG_DIRECTORY}/${tankID}`)) {
        // create directory for tankID
        fs.mkdirSync(`${process.env.IMG_DIRECTORY}/${tankID}`);
    }
    
    // Move file from tmp to IMG_DIRECTORY and give it the filename
    fs.rename(file.path, `${process.env.IMG_DIRECTORY}/${tankID}/${file.name}`, (err) => {
        if (err) throw err;
        console.log(`${file.path} moved to ${process.env.IMG_DIRECTORY}/${tankID}/${file.name}`)
    });
}