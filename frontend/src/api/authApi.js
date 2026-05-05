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

export const findPassword = (email) => { 
    return axiosInstance.post(`/auth/password/forgot?email=${email}`);
}

export const sendValificationCode = (data) => { 
    return axiosInstance.post("/auth/password/code", data);
};

export const resetPassword = (data) => { 
    return axiosInstance.post("/auth/password/reset", data);
};

export const signOut = () => { 
    return axiosInstance.post("/auth/signout");
}