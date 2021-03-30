import express, { Request, Response } from 'express';
import { BaseTank, Tank, TankKeys } from './tank.interface';
import { Tanks } from './tanks.interface';
import * as TankService from './tanks.service';
import * as Helper from '../helper';

export const tanksRouter = express.Router();

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
        console.log(req.body.data)
        const tank: BaseTank = req.body.data;
        console.log(tank.age);
        const newTank = await TankService.create(tank);

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