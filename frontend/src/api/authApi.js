import axiosInstance from "./axiosInstance"

export const signIn = (data) => { 
    return axiosInstance.post("/auth/signin", data)
}

export const signUp = (data) => { 
    return axiosInstance.post("/auth/signup", data)
}