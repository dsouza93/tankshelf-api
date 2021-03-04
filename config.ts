import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    db: {
        HOST: process.env.HOST,
        USER: process.env.SQL_USER,
        PASSWORD: process.env.PASSWORD,
        DATABASE: process.env.DATABASE,
    },
    server: {
        PORT: process.env.PORT
    },
    auth: {
        PASSPORT_SESSION_SECRET: process.env.PASSPORT_SESSION_SECRET,
        GOOG_CLIENT_ID: process.env.GOOG_CLIENT_ID,
        GOOG_CLIENT_SECRET: process.env.GOOG_CLIENT_SECRET
    }
}