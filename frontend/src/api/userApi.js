import axiosInstance from "./axiosInstance"

export const getMyInfo = () => {
    return axiosInstance.get("/api/user/me");
};

export const updateMyInfo = (userInfo) => {
    return axiosInstance.put("/api/user/me", userInfo);
};