import type { User } from "./user";

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

export interface ProjectUserBackend {
  id?: number;
  role: "MASTER" | "DEVELOPER";
  user?: User;
  userId: number;
}

export interface ExtendedProject extends Project {
  projectUsers?: ProjectUserBackend[];
  members?: ProjectUserBackend[];
}

export interface ExtendedProject extends Project {
  projectUsers?: ProjectUserBackend[];
  members?: ProjectUserBackend[];
}

export type GetMembersResponse = ProjectMember[];
