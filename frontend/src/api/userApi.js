import axiosInstance from "./axiosInstance"

export const getMyInfo = () => {
    return axiosInstance.get("/users/me");
};

export const updateMyInfo = (userInfo) => {
    return axiosInstance.post("/users/me", userInfo);
};