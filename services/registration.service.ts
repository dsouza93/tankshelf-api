import { rejects } from 'assert';
import { Profile } from 'passport-google-oauth20';
import * as UserService from '../users/users.service';

export const findOrCreate = async(profile: Profile) => {
    const userExists = await emailExists(profile._json.email);
    if (userExists.length === 0) {
        try {
            console.log(`Creating new user with email: ${profile._json.email}`);
            const newUser = await UserService.create(profile);
            return newUser;
        } catch(e) {
            throw e;
        }
    } else {
        console.log(`User with email: ${profile._json.email} already exists.`)
        return userExists[0];
    }
}

const emailExists = async(email: string): Promise<User> => {
    try {
        var user = await UserService.findByEmail(email);
        return user;
    } catch(e) {
        console.log(`Error in emailExists: ${e}`)
    }
}