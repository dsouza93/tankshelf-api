import express, { Request, Response } from 'express';
import { BaseTank, Tank } from './tank.interface';
import { Tanks } from './tanks.interface';
import * as TankService from './tanks.service';

export const tanksRouter = express.Router();

// GET tanks
tanksRouter.get('/', async(req: Request, res: Response) => {
    try {
        const tanks: Tank[] = await TankService.findAll().then(() => console.log(tanks));

        res.status(200).send(tanks);
    } catch (e) {
        res.status(500).send(e.message);
    }
});