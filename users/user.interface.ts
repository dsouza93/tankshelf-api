export interface User {
    userID: string;
    email: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    google_id?: string;
}