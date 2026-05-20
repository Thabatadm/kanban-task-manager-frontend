import type { Project } from "./project";
import type { User } from "./user"; 

export type CardStatus = 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type CardPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';


export interface Card {
  id: number;
  title: string;
  description: string;
  status: CardStatus;
  position: number;
  priority: CardPriority;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  project: Project;
  assignee: User | null; 
}


export interface CreateCardRequest {
  title: string;
  description: string;
  status: CardStatus;
  priority: CardPriority;
  dueDate: string;     
  projectId: number;    
  assigneeId?: number | null; 
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  status?: CardStatus;
  priority?: CardPriority;
  position?: number;   
  dueDate?: string;
  assigneeId?: number | null; 
}


export interface CardResponse { 
  id: number;
  title: string;
  description: string;
  status: CardStatus;
  position: number;     
  priority: CardPriority;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  project: Project;
  assignee: User | null; 
}