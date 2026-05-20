export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string; 
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  developerIds: number[];
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  createdAt: string; 
  developers: {
    id: number;
    name: string;
    lastName: string;
    email: string;  
  }[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  developerIds?: number[];
}


export interface ProjectMember {
  id: number;
  name: string;
  lastName: string;
  email: string;  
}


export type GetMembersResponse = ProjectMember[];