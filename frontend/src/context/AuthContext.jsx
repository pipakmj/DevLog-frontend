/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { signOut } from "../api/authApi";
import { getMyInfo } from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const logout = useCallback(async (options = { silent: false }) => {
        try {
            if (!options.silent) {
                await signOut();
            }
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("nickname");
            setIsLoggedIn(false);
            setUser(null);

            if (!options.silent) {
                if (options.message) alert(options.message);
                window.location.href = "/signin";
            }
        }
    }, []);

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser({ nickname: userData.nickname, userId: userData.id });
        if (userData.nickname) {
            localStorage.setItem("nickname", userData.nickname);
        }
    };

    useEffect(() => {
        const validateSession = async () => { 
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await getMyInfo();
                setIsLoggedIn(true);
                setUser({ nickname: res.data.data.nickname, userId: res.data.data.id });
            } catch (error) {
                console.error("세션이 만료되었거나 올바르지 않습니다.", error);
                logout({ silent: true });
            } finally { 
                setIsLoading(false);
            }

        };
        validateSession();
    }, [logout]);

    useEffect(() => {
        const handleAuthLogout = (event) => {
            const message = event.detail?.message || "세션이 만료되었습니다.";
            logout({ silent: false, message });
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