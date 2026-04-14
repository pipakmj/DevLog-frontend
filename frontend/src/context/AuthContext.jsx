/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { signOut } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("accessToken"));
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(() => {
        const nickname = localStorage.getItem("nickname");
        return nickname ? { nickname } : null;
    });

    const logout = useCallback(async (options = { silent: false }) => {
        try {
            if (!options.silent) {
                await signOut();
            }
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("nickname");

            if (!options.silent) {
                if (options.message) alert(options.message);
                window.location.href = "/signin";
            }
        }
    }, []);

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser({ nickname: userData.nickname });
        if (userData.nickname) {
            localStorage.setItem("nickname", userData.nickname);
        }
    };

    useEffect(() => {
        // 앱이 처음 로드될 때 로컬 스토리지 정보를 확인하거나 
        // 서버에 세션 유효성 검사를 요청할 수 있는 지점입니다.
        const token = localStorage.getItem("accessToken");
        if (token) {
            // 여기에 나중에 세션 유효성 검사 로직을 넣을 예정입니다.
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setIsLoading(false); // 확인이 끝나면 로딩 완료 처리
    }, []);

    useEffect(() => {
        const handleAuthLogout = (event) => {
            const message = event.detail?.message;
            logout({ silent: true, message });
            window.location.href = "/signin";
        };

        window.addEventListener("auth:logout", handleAuthLogout);
        return () => window.removeEventListener("auth:logout", handleAuthLogout);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, login, isLoggedIn, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};