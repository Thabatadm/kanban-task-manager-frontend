
import api from '../api/axios';
import type { CreateCardRequest, UpdateCardRequest, CardResponse } from '../types/card'; 

export const cardService = {
    getCardsByProject: async (projectId: number): Promise<CardResponse[]> => {
        try {
            const response = await api.get<CardResponse[]>(`/project/${projectId}/cards`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cards for project:', error);
            throw error;
        }   
    },
    createCard: async (data: CreateCardRequest, projectId: number): Promise<CardResponse> => {
        try {
            const response = await api.post<CardResponse>(`/projects/${projectId}/cards/create`, data);   
            return response.data;
        } catch (error) {
            console.error('Error creating card:', error);
            throw error;
        }
    },
    updateCard: async (id: number, data: UpdateCardRequest, projectId: number): Promise<CardResponse> => {
        try {
            const response = await api.put<CardResponse>(`/projects/${projectId}/cards/update/${id}`, data);      
            return response.data;
        } catch (error) {
            console.error('Error updating card:', error);
            throw error;
        }   
    },
    deleteCard: async (id: number, projectId: number): Promise<void> => {
        try {
            await api.delete(`/projects/${projectId}/cards/delete/${id}`);        
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error;
        }   
    }
}