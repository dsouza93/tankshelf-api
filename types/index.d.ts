import { User } from "../users/user.interface";

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}