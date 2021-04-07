import express, { Request, Response } from 'express';
import formidable from 'formidable';
import * as MediaService from './media.service';
import * as fs from 'fs';
import * as Helper from '../helper';

export const mediaRouter = express.Router();

// Moves image from tmp dir to IMG_DIRECTORY and renames with the filename, returns URL location of image on the filesystem
const moveToUploads = async(tankID: string, file: formidable.File) => {

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

// GET images
mediaRouter.get('/:id', async(req: Request, res: Response) => {
    console.log('get api/media/:id');
    try {
        const id = req.params.id;
        const images = await MediaService.findImages(id);

        return res.status(200).json(images);
    } catch(e) {
        return res.status(500).send(e);
    }
});


// POST images
mediaRouter.post('/upload', async(req: Request, res: Response) => {
    console.log('/upload')
    try {
        const form = new formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if(err) {
                return res.status(400).json({error: err.message});
            }

            // Get id from formdata fields to set as foreign key relation for images
            const { tankID } = fields;
            
            // Destructure file names, loop through files and move from tmp dir to IMG_DIRECTORY
            const uploadedFiles = Object.keys(files);
            for (let i = 0; i < uploadedFiles.length; i++) {
                let file = files[uploadedFiles[i]] as formidable.File;
                moveToUploads(tankID as string, file);
                MediaService.addImage(tankID as string, `${process.env.IMG_DIRECTORY}/${tankID}/${file.name}`)
                .then(res => console.log(res))
                .catch(e => console.error(e));
            }

            res.status(200).json({ fields: files});
        });
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// mediaRouter.delete('/:id', async(req: Request, res: Response) => {
//     try {
//         const id: number = parseInt(req.params.id, 10);

//         await TankService.remove(id);
//         res.send(204);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
// });

export default mediaRouter;