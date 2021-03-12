import { NextFunction } from 'express';
import passport from 'passport';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // use passport.js isAuthenticated() method to check if user session is logged in
    if(req.isAuthenticated()) {
        console.log(`is user authenticated? ${req.isAuthenticated()}`);
        next();
    } else {
        return console.log(`user is not Authenticated`);
    }
}