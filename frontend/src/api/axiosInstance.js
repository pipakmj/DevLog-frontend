import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")

        if (token) { 
            config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance