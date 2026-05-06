import axiosInstance from "./axiosInstance";

export const getAllProjects = (page = 0, size = 9) => {
    return axiosInstance.get(`/api/project/all?page=${page}&size=${size}`)
};

export const getProjects = (page = 0, size = 9) => {
    return axiosInstance.get(`/api/project/mine?page=${page}&size=${size}`);
};

export const getProjectsToPost = () => {
    return axiosInstance.get(`/api/project/mine/post`);
};

export const getDetailProject = (porjectId) => { 
    return axiosInstance.get(`/api/project/${porjectId}`);
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

export const gitHubAnalyze = (gitUrl) => { 
    return axiosInstance.post("/api/github/analyze", gitUrl, {
        timeout: 60000
    })
};