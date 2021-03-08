import express, { Request, Response } from 'express';
import passport from 'passport';
// Import passport authentication strategy
require('./passport.auth');

export const authRouter = express.Router();

authRouter.get('/login', passport.authenticate("google", { scope: ["profile", "email"] }), (req: Request, res: Response) => {
    res.send('Successfully Authenticated');
});

authRouter.get('/user', (req: Request ,res: Response) => {
    // console.log(`auth.router.ts /user`, req.user)
    res.send(req.user);
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

// Endpoint that sends user to external Google login page
authRouter.get("/google", passport.authenticate('google', { scope: ["profile", "email"] }));
// authRouter.post("/google", passport.authenticate('google', { scope: ["profile", "email"] }));

// Endpoint that Google login sends user to upon successful Google auth
authRouter.get("/google/redirect", 
    passport.authenticate('google', { 
        successRedirect: 'http://localhost:3000/profile',
        failureRedirect: '/failed' 
    })
);

// Logout from Google auth endpoint
authRouter.get('/logout', (req: Request, res: Response) => {
    req.session = null;
    req.logout();
    res.send('logged out');
});