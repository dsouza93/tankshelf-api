import express, { Request, Response } from 'express';
import formidable from 'formidable';
import { BaseTank, Tank, TankKeys } from './tank.interface';
import { Tanks } from './tanks.interface';
import * as TankService from './tanks.service';

export const tanksRouter = express.Router();

export interface FormFields {
    data: formidable.Fields;
    images: { [key: string ]: formidable.File[] | formidable.File }
}

// GET tanks
tanksRouter.get('/', async(req: Request, res: Response) => {
    try {
        const tanks = await TankService.findAll();
        res.status(200).send(tanks);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

tanksRouter.get('/:id', async(req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const tank = await TankService.find(id);

        res.status(201).json(tank);
    } catch(e) {
        res.status(500).send(e);
    }
});

// PUT tanks
tanksRouter.put('/:id', async(req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedTank = await TankService.update(id, req.body);

        res.status(201).json(updatedTank);
    } catch(e) {
        res.status(500).send(e);
    }
});

// POST tanks
tanksRouter.post('/addTank', async(req: Request, res: Response) => {
    try {
        console.log('addTank endpoint: ', req.user.userID);
        const form = new formidable({ multiples: true });
        var formFields: FormFields = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if(err) {
                    return res.status(400).json({error: err.message});
                }
    
                // console.log('field: ', fields);
                // console.log('files: ', files);
                resolve({data: fields, images: files})
            
    
            })
        })

        console.log('creating NEW TANK')
        const tank: BaseTank = formFields.data;
        const images = formFields.images;
        const newTank = await TankService.create(tank, images, req.user.userID);
        
        console.log('final newTank');
        console.log(newTank)
        res.status(201).json(newTank);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

tanksRouter.delete('/:id', async(req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);

        await TankService.remove(id);
        res.send(204);
    } catch(e) {
        res.status(500).send(e.message);
    }
});