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

export const updatePostViewCount = (postId) => { 
    return axiosInstance.patch(`/api/posts/${postId}/views`);
};

export const deletePost = (postId) => {
    return axiosInstance.delete(`/api/posts/${postId}`);
 };