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
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");
                const res = await axios.post("http://localhost:8080/auth/refresh", { refreshToken: refreshToken });
                const newAccessToken = res.data?.data.access_token;
                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (err) {
                localStorage.clear();
                window.location.href = "/signin";
                alert("다시 로그인해 주세요.");
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance