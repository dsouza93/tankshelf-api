import express, { Request, Response } from 'express';
import passport from 'passport';
// Import passport authentication strategy
require('./passport.auth');

export const authRouter = express.Router();

// Endpoint that sends user to external Google login page
authRouter.get("/google", passport.authenticate('google', { scope: ["profile", "email"] }));

// Endpoint that Google login sends user to upon successful Google auth
authRouter.get("/google/redirect", 
    passport.authenticate('google', { failureRedirect: '/failed' }),
    (req: Request, res: Response) => {
     res.redirect('/good');
    });

// Logout from Google auth endpoint
authRouter.get('/logout', (req: Request, res: Response) => {
    req.session = null;
    req.logout();
    res.send('logged out');
});