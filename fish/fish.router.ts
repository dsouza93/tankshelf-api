import express, { Request, Response } from 'express';
import * as FishService from './fish.service';

export const fishRouter = express.Router();


// GET tanks
fishRouter.get('/freshwater/', async(req: Request, res: Response) => {
    try {
        const fish = await FishService.findAll();
        res.status(200).send(fish);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

fishRouter.get('/tank/:id', async(req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const fish = await FishService.findByTankID(id);

        res.status(201).json(fish);
    } catch(e) {
        res.status(500).send(e);
    }
});

export default fishRouter;