import api from '../api/axios'; 
import type { UpdateUserRequest, UpdateUserResponse, UserProfile  } from '../types/user';


export const userService = {

    getProfile: async (): Promise<UserProfile> => {
        try {
            const response = await api.get<UserProfile>('/user/me');
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile", error);
            throw error;
        }
    },

    updateProfile: async (data: UpdateUserRequest): Promise<UpdateUserResponse> => {
        try {
            const response = await api.put<UpdateUserResponse>('/user/update', data);
            return response.data;
        } catch (error) {
            console.error("Error updating user profile", error);
            throw error;
        }
    },

    deleteAccount: async (): Promise<void> => {
        try {
            await api.delete('/user/delete');
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userLastName');
            window.location.href = '/login';    
        } catch (error) {
            console.error("Error deleting user account", error);
            throw error;
        }   
}
}
