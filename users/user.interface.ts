export interface User {
    userID: number;
    email: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}