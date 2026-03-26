/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { signOut } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("accessToken"));
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
        const handleAuthLogout = (event) => {
            const message = event.detail?.message;
            logout({ silent: true, message });
            window.location.href = "/signin";
        };

        window.addEventListener("auth:logout", handleAuthLogout);
        return () => window.removeEventListener("auth:logout", handleAuthLogout);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, login, isLoggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};