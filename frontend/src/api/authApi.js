import axiosInstance from "./axiosInstance"

export const getExpiryTime = (token) => { 
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000;
    } catch (error) {
        return 0;
    }
}

export const signIn = (data) => { 
    return axiosInstance.post("/auth/signin", data)
}

export const signUp = (data) => { 
    return axiosInstance.post("/auth/signup", data)
}