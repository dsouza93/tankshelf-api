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

// fishRouter.get('/:id', async(req: Request, res: Response) => {
//     try {
//         const id = parseInt(req.params.id, 10);
//         const tank = await TankService.find(id);

//         res.status(201).json(tank);
//     } catch(e) {
//         res.status(500).send(e);
//     }
// });

// // PUT tanks
// fishRouter.put('/:id', async(req: Request, res: Response) => {
//     try {
//         const id = parseInt(req.params.id, 10);
//         const updatedTank = await TankService.update(id, req.body);

//         res.status(201).json(updatedTank);
//     } catch(e) {
//         res.status(500).send(e);
//     }
// });

// // POST tanks
// fishRouter.post('/addTank', async(req: Request, res: Response) => {
//     try {
//         const form = new formidable({ multiples: true });
//         var formFields: Tank = await new Promise((resolve, reject) => {
//             form.parse(req, (err, fields, files) => {
//                 if(err) {
//                     return res.status(400).json({error: err.message});
//                 }
    
//                 let tankData = {
//                     name: fields.name as string,
//                     type: fields.type as WaterTypes,
//                     age: parseInt(fields.age as string),
//                     description: fields.description as string,
//                     images: files
//                 }

//                 resolve(tankData)
//             });
//         })

//         const tank: Tank = formFields;
//         const newTank = await TankService.create(tank, req.user.userID);
        
//         console.log('Tank Created:');
//         console.log(newTank)
//         res.status(201).json(newTank);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
// });

// fishRouter.delete('/:id', async(req: Request, res: Response) => {
//     try {
//         const id: number = parseInt(req.params.id, 10);

//         await TankService.remove(id);
//         res.send(204);
//     } catch(e) {
//         res.status(500).send(e.message);
//     }
// });

export default fishRouter;