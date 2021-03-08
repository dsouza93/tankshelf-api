import { NextFunction, Request, Response } from 'express';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    // console.log('auth.middleware.ts', req.user);
    if(req.user) {
        next();
    } else {
        res.sendStatus(401);
    } 
}