import axiosInstance from "./axiosInstance";

export const getAllPosts = (page = 0, size = 10) => {
    return axiosInstance.get(`/api/posts?page=${page}&size=${size}`);
};

export const getPostDetail = (postId) => {
    return axiosInstance.get(`/api/posts/${postId}`);
};

export const createPost = (postData) => {
    return axiosInstance.post("/api/posts", postData);
};