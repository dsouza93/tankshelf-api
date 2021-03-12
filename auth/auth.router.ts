import express, { Request, Response } from 'express';
import passport from 'passport';
import { isAuthenticated } from './auth.service';
// Import passport authentication strategy
require('./passport.auth');

export const authRouter = express.Router();

// Google OAuth Passport Routes
// Endpoint that sends user to external Google login page
authRouter.get("/google", passport.authenticate('google', { scope: ["profile", "email"] }), (req: Request, res: Response) => console.log(`inside /google callback: ${console.log(req.sessionID)}`));
// authRouter.post("/google", passport.authenticate('google', { scope: ["profile", "email"] }));

// Endpoint that Google login sends user to upon successful Google auth
authRouter.get("/google/redirect", 
    passport.authenticate('google', { 
        // successRedirect: '/user/profile',
        failureRedirect: '/failed' 
    }), (req: Request, res: Response) => {
        console.log(`inside /google/redirect callback, req.session:`)
        console.log(Object.entries(req.session));
        console.log(req.sessionID);
        console.log(req.isAuthenticated(), 'redirecting to frontend profile');
        res.redirect('http://localhost:3000/user/profile')
    }
);

authRouter.get('/login', passport.authenticate("google", { scope: ["profile", "email"] }), (req: Request, res: Response) => {
    res.send('Successfully Authenticated');
});

authRouter.get('/user', isAuthenticated, (req: Request ,res: Response) => {
    console.log(`auth.router.ts /user`, req.user)
    res.status(200).send({user: req.user});
});

// Endpoint for successful login, get user info
authRouter.get("/login/success", (req: Request, res: Response) => {
    if (req.user) {
        res.json({
            success: true,
            message: `${req.user} successfully authenticated`,
            user: req.user,
            cookies: req.cookies
        });
    }
});

// Endpoint to indicate failed login
authRouter.get("/login/failure", (req: Request, res: Response) => {
    res.status(401).json({
        success: false,
        message: "authentication failed"
    });
});

// Logout from Google auth endpoint
authRouter.get('/logout', isAuthenticated, (req: Request, res: Response) => {
    console.log(`logging out user ${req.user}`)
    req.session = null;
    req.logout();
    res.send('logged out');
});