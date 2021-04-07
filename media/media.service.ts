const db = require('../services/db');

interface Image {
    id: string;
    name: string;
    url: string;
}

// Add image location and associated tank ID to database
export const addImage = async(tankID: string, url: string): Promise<boolean> => {
    const result = await db.pool.query("INSERT INTO images (id, tankID, url) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?)", [tankID, url]);
    if (result[0].affectedRows > 0) {
        return true;
    }
    return false;
}

export const findImages = async(tankID: string): Promise<any[]> => {
    const result = await db.pool.query("SELECT url FROM tankshelf.images WHERE tankID = UUID_TO_BIN(?)", [tankID]);
    console.log(result[0][0].url);

    return result[0];
}