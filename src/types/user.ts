import type { Project } from "./project";

export type ProjectRole = 'MASTER' | 'DEVELOPER';


export interface UpdateUserRequest {
  name: string;
  lastName: string;
  email?: string;
  password?: string;
}

export interface GrantedAuthority {
  authority: string;
}

export interface ProjectUser {
  id: number;
  project: Project; 
  role: ProjectRole; 
}

export interface User {
  id: number;
  email: string;
  name: string;
  lastName: string;
  password?: string;
  username: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  authorities: { authority: string }[];
  projects: ProjectUser[]; 
}


export interface UpdateUserResponse {
  id: number;
  email: string;
  name: string;
  lastName: string;
  username: string;

}


export interface UserProfile {
  id: number;
  email: string;
  name: string;
  lastName: string;
  username: string;
  projects: Project[]; 
}






