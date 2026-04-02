import axiosInstance from "./axiosInstance";

export const getProjects = () => {
    return axiosInstance.get("/api/project/mine");
};

export const createProject = (userProject) => {
    return axiosInstance.post("/api/project/create", userProject);
};

export const updateProject = (projectId, userProject) => {
    return axiosInstance.patch(`/api/project/${projectId}`, userProject);
};

export const deleteProject = (projectId) => {
    return axiosInstance.delete(`/api/project/${projectId}`);
};