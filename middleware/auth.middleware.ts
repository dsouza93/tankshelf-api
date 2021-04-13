import { NextFunction, Request, Response } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // use passport.js isAuthenticated() method to check if user session is logged in
    if(req.isAuthenticated()) {
        console.log(`is user authenticated? ${req.isAuthenticated()}`);
        console.log(req.user)
        next();
    } else {
        console.log(`user is not Authenticated`)
        res.status(401).send({ error: 'user not authenticated'});
    }
}