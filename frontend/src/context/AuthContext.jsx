/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { getExpiryTime } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("accessToken"));
    const [user, setUser] = useState(() => {
        const nickname = localStorage.getItem("nickname");
        return nickname ? { nickname } : null;
    });

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("nickname");
        alert("세션이 만료되어 로그아웃 되었습니다.");
        window.location.href = "/signin";
    }, []);

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        if (userData.nickname) {
            localStorage.setItem("nickname", userData.nickname);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token && isLoggedIn) {
            try {
                const expiryTime = getExpiryTime(token);
                const currentTime = Date.now();
                const timeout = expiryTime - currentTime;

                if (timeout <= 0) {
                    logout();
                } else {

                    const timer = setTimeout(() => {
                        logout();
                    }, timeout);
                    return () => clearTimeout(timer);
                }
            } catch (e) {
                console.error("Token decoding error:", e);
                logout();
            }
        }
    }, [isLoggedIn, logout]);

    return (
        <AuthContext.Provider value={{ user, login, isLoggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    )
}