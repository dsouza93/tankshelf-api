import express, { Request, Response } from 'express';
import formidable from 'formidable';
import { isAuthenticated } from '../middleware/auth.middleware';
import * as MediaService from './media.service';

export const mediaRouter = express.Router();

// GET images
mediaRouter.get('/:id', async(req: Request, res: Response) => {
    console.log('get api/media/:id');
    try {
        const id = parseInt(req.params.id);
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
                MediaService.moveToUploads(tankID as string, file);
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

mediaRouter.delete('/:id', isAuthenticated, async(req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);

        await MediaService.remove(id);
        res.send(204);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

export default mediaRouter;