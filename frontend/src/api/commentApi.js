import axiosInstance from "./axiosInstance";

export const getComments = (postId) => { 
    return axiosInstance.get(`/api/posts/${postId}/comments`);
};

export const createComment = (postId, content, parentId = null) => { 
    return axiosInstance.post(`/api/posts/${postId}/comments`, { content, parentId });
};

export const updateComment = (commentId, content) => {
    return axiosInstance.patch(`/api/posts/${commentId}/comments`, { content })
};

export const deleteComment = (commentId) => { 
    return axiosInstance.delete(`/api/posts/${commentId}/comments`);
};