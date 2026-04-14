import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
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
        if (error.code === "ECONNABORTED" && error.message.includes("timeout")) { 
            alert("서버응답이 너무 느립니다. 잠시 후 다시 시도해주세요.");
            return Promise.reject(new Error("Request Timeout"));
        }

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
                const newAccessToken = res.data?.data?.access_token || res.data?.data?.accessToken;

                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                window.dispatchEvent(new CustomEvent("auth:logout", {
                    detail: { message: "세션이 만료되었습니다. 다시 로그인해 주세요." }
                }));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance