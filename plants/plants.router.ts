import express, { Request, Response } from 'express';
import * as PlantsService from './plants.service';

export const plantsRouter = express.Router();


// GET tanks
plantsRouter.get('/freshwater/', async(req: Request, res: Response) => {
    try {
        const plants = await PlantsService.findAll();
        res.status(200).send(plants);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

plantsRouter.get('/tank/:id', async(req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const plants = await PlantsService.findByTankID(id);

        res.status(201).json(plants);
    } catch(e) {
        res.status(500).send(e);
    }
});

export default plantsRouter;