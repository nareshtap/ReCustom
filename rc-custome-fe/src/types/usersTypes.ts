export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    logins?: number;
    downloads?: number;
}
