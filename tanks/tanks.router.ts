import express, { Request, Response } from 'express';
import Formidable from 'formidable';
import formidable from 'formidable';
import { BaseTank, Tank, TankKeys, WaterTypes } from './tank.interface';
import { isAuthenticated } from '../middleware/auth.middleware';
import * as TankService from './tanks.service';

export const tanksRouter = express.Router();

export interface FormFields {
    data: BaseTank;
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
        const id = parseInt(req.params.id, 10);
        const tank = await TankService.find(id);

        res.status(201).json(tank);
    } catch(e) {
        res.status(500).send(e);
    }
});

// PUT tanks
tanksRouter.put('/:id', isAuthenticated, async(req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedTank = await TankService.update(id, req.body);

        res.status(201).json(updatedTank);
    } catch(e) {
        res.status(500).send(e);
    }
});

// POST tanks
tanksRouter.post('/addTank', isAuthenticated, async(req: Request, res: Response) => {
    try {
        const form = new formidable({ multiples: true });
        var formFields: Tank = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if(err) {
                    return res.status(400).json({error: err.message});
                }

                let tankData = {
                    name: fields.name as string,
                    type: fields.type as WaterTypes,
                    age: parseInt(fields.age as string),
                    description: fields.description as string,
                    images: files,
                    inhabitants: JSON.parse(fields.inhabitants as string),
                    plants: JSON.parse(fields.plants as string)
                }

                resolve(tankData)
            });
        })

        const tank: Tank = formFields;
        const newTank = await TankService.create(tank, req.user.userID);
        
        console.log('Tank Created:');
        console.log(newTank)
        res.status(201).json(newTank);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

tanksRouter.delete('/:id', isAuthenticated, async(req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);

        await TankService.remove(id);
        res.send(204);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

export default tanksRouter;