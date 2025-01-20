import { User } from "../types/usersTypes";
import { request } from "./api";
import { CreateUserResponse, GetUsersResponse, UserMetrics } from "./type";



export const getAllUsers = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "name",
    order: "asc" | "desc" = "asc",
    search: string = ""
): Promise<GetUsersResponse> => {
    try {
        const response = await request<GetUsersResponse>({
            method: "GET",
            url: "/users",
            params: { page, limit, sortBy, order, search },
        });
        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }

        throw new Error("An unknown error occurred while fetching users");
    }
};

export const createUser = async (user: Partial<User>): Promise<CreateUserResponse> => {
    try {
        const response = await request<CreateUserResponse>({
            method: "POST",
            url: "/users",
            data: user,
        });
        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }

        throw new Error("An unknown error occurred while creating the user");
    }
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
    try {
        const response = await request<User>({
            method: "PUT",
            url: `/users/${id}`,
            data: user,
        });
        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }

        throw new Error("An unknown error occurred while updating the user");
    }
};

export const removeUser = async (id: number): Promise<void> => {
    try {
        await request<void>({
            method: "DELETE",
            url: `/users/${id}`,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }

        throw new Error("An unknown error occurred while deleting the user");
    }
};

export const getUserActivityMetrics = async (userId: number): Promise<UserMetrics> => {
    try {
        const response = await request<UserMetrics>({
            method: "GET",
            url: `activity-logs/${userId}`,
        });
        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch user activity logs: ${error.message}`);
        }

        throw new Error("An unknown error occurred while fetching user activity logs");
    }
};

export const downloadUserPdf = async (userId: number): Promise<void> => {
    try {
        const response = await request<Blob>({
            method: "GET",
            url: `pdf/download/${userId}`,
            responseType: "blob"
        });

        const blobUrl = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `user_${userId}_report.pdf`
        link.click();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to download user PDF: ${error.message}`);
        }

        throw new Error("An unknown error occurred while downloading user PDF");
    }
};
