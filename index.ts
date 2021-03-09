import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import passport from 'passport';
import { config } from './config';
import { tanksRouter } from './tanks/tanks.router';
import { authRouter } from './auth/auth.router';
import { isLoggedIn } from './middleware/auth.middleware';
// const cookieSession = require('cookie-session');
const session = require('express-session');

if (!config.server.PORT) {
    process.exit();
}

const PORT: number = parseInt(config.server.PORT as string, 10);

const app = express();
// Setup cookie session
app.use(session({
    name: 'tankSesh',
    resave: false,
    saveUninitialized: false,
    secret: config.auth.PASSPORT_SESSION_SECRET
}));
// app.use(cookieSession({
//     name: 'TankShelf-session',
//     keys: [config.auth.PASSPORT_SESSION_SECRET]
// }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,POST,DELETE",
    credentials: true
}));
app.use(bodyParser.json());

app.use("/api/tanks/", tanksRouter);
app.use("/auth/", authRouter);
app.use("/user/", userRouter);

app.get('/failed', (req: Request, res: Response) => res.send('You failed to login'));
app.get('/good', isLoggedIn, (req: Request, res: Response) => res.send(`Welcome ${req.user.displayName}`));


app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});