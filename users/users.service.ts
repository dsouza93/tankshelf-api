import { NextFunction } from 'express';
import moment from 'moment';
import { Profile } from 'passport-google-oauth20';
import { User } from './user.interface';
import { Users } from './users.interface';
const db = require('../services/db');

export const findByEmail = async(email: string): Promise<User | null> => {
    const rows = await db.pool.query('SELECT * FROM users WHERE email = ?', [email]);    
    return rows[0];
}

export const create = async(profile: Profile) => {
    const createdAt = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const rows = await db.pool.query('INSERT INTO users (email, first_name, last_name, display_name, created_at, updated_at, google_id) VALUES(?, ?, ?, ?, ?, ?, ?)', 
        [profile._json.email, profile._json.given_name, profile._json.family_name, profile.displayName, createdAt, createdAt, profile.id]);
    
    return rows[0];
}