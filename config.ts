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
    }
}