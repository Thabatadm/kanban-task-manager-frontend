import api from "../api/axios";
import type {
  CreateProjectRequest,
  ProjectResponse,
  Project,
  UpdateProjectRequest,
} from "../types/project";

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get<Project[]>("/api/projects");
      return response.data;
    } catch (error) {
      console.error("Error fetching projects", error);
      throw error;
    }
  },
  createProject: async (
    data: CreateProjectRequest,
  ): Promise<ProjectResponse> => {
    try {
      const response = await api.post<ProjectResponse>(
        "/api/projects/create",
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating project", error);
      throw error;
    }
  },
  updateProject: async (
    id: number,
    data: UpdateProjectRequest,
  ): Promise<ProjectResponse> => {
    try {
      const response = await api.put<ProjectResponse>(
        `/api/projects/update/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating project", error);
      throw error;
    }
  },
  deleteProject: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/projects/delete/${id}`);
    } catch (error) {
      console.error("Error deleting project", error);
      throw error;
    }
  },

  addProjectMember: async (
    projectId: number,
    memberData: { userId: number; role: "MASTER" | "DEVELOPER" },
  ) => {
    const payload = {
      userId: Number(memberData.userId),
      role: memberData.role,
    };

    const response = await api.post(
      `/api/projects/${projectId}/members`,
      payload,
    );
    return response.data;
  },

  deleteProjectMember: async (
    projectId: number,
    userId: number,
  ): Promise<void> => {
    try {
      await api.delete(`/api/projects/${projectId}/members/${userId}`);
    } catch (error) {
      console.error("Error deleting project member", error);
      throw error;
    }
  },
};
