import { User } from "../types/usersTypes";

export interface GetUsersResponse {
    data: User[];
    meta: {
        currentPage: number;
        nextPage: number | null;
        total: number;
        remaining: number;
    };
}

export interface CreateUserResponse {
    data: User;
}

export interface UserMetrics {
    user: User
    metrics: {
        logins: number;
        downloads: number;
    }
}