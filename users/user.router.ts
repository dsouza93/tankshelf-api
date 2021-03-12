import express, { NextFunction, Request, Response } from 'express';
import * as UserService from './users.service';
import passport from 'passport';
require('../auth/passport.auth');

const userRouter = express.Router();

userRouter.get('/profile', passport.authenticate('google', { session: false }),(req: Request, res: Response, next: NextFunction) => {
    console.log('userRouter - profile', req.user)
    res.json({ success: true, msg: 'You are authorized.' });
});

export default userRouter;