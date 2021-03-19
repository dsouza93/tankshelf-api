import express, { Request, Response } from 'express';
import passport from 'passport';
import { isAuthenticated } from './auth.service';
// Import passport authentication strategy
require('./passport.auth');

export const authRouter = express.Router();

// Google OAuth Passport Routes
// Endpoint that sends user to external Google login page
authRouter.get("/google", passport.authenticate('google', { scope: ["profile", "email"] }), (req: Request, res: Response) => console.log(`inside /google callback: ${console.log(req.sessionID)}`));

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

// Logout from Google auth endpoint
authRouter.get('/logout', isAuthenticated, (req: Request, res: Response) => {
    console.log(`logging out user ${req.user}`)
    req.logout();
    console.log('/logout is authenticated', req.isAuthenticated());
    // res.redirect(`${process.env.FRONT_END_BASE_URL}`);
    res.send('logged out');
});

authRouter.get('/user', isAuthenticated, (req: Request ,res: Response) => {
    console.log(`auth.router.ts /user`, req.user)
    if (req.user) {
        const userData = {
            display_name: req.user.display_name,
            email: req.user.email,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
        }
        res.status(200).send(userData);
    } else {
        res.status(500).send({succes: false, error: "req.user not found"});
    }
});

authRouter.get('/loggedin', isAuthenticated, (req: Request, res: Response) => {
    console.log(`/loggedin user is authenticated: ${req.isAuthenticated()}`);
    console.log(req.user.display_name);
    if(req.user) {
    res.json({ loggedin: true });
    } else {
        res.json({ loggedin: false });
    }
});

// Endpoint for successful login, get user info
// authRouter.get("/login/success", (req: Request, res: Response) => {
//     if (req.user) {
//         res.json({
//             success: true,
//             message: `${req.user} successfully authenticated`,
//             user: req.user,
//             cookies: req.cookies
//         });
//     }
// });

// Endpoint to indicate failed login
// authRouter.get("/login/failure", (req: Request, res: Response) => {
//     res.status(401).json({
//         success: false,
//         message: "authentication failed"
//     });
// });

