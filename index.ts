import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import { v4 as uuid } from 'uuid';
import { config } from './config';
import tanksRouter from './tanks/tanks.router';
import authRouter from './auth/auth.router';
import userRouter from './users/user.router';
import mediaRouter from './media/media.router';
import plantsRouter from './plants/plants.router';
import fishRouter from './fish/fish.router';
import session from 'express-session';


if (!config.server.PORT) {
    process.exit();
}

const PORT: number = parseInt(config.server.PORT as string, 10);

const app = express();
// Setup cookie session
app.use(session({
    genid: (req: Request) => {
        return uuid();
    },
    name: 'tankSesh',
    resave: false,
    saveUninitialized: true,
    secret: config.auth.PASSPORT_SESSION_SECRET as string
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: FRONT_END_BASE_URL,
    methods: "GET,HEAD,PUT,POST,DELETE",
    credentials: true
}));
app.use(express.json());

app.use("/api/tanks/", tanksRouter);
app.use("/api/media/", mediaRouter);
app.use("/api/plants/", plantsRouter);
app.use("/api/fish/", fishRouter);
// serve static local directory for images
app.use("/media/tankshelf/uploads", express.static('/media/tankshelf/uploads/'));
app.use("/auth/", authRouter);
app.use("/user/", userRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
