import { createContext, useState } from "react";
import { signIn } from "../api/authApi";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const login = async (data) => { 
        const res = await signIn(data)
        setUser(res.data.user)
    }

    return (
        <AuthContext.Provider value={{ user, login }}>
            { children }
        </AuthContext.Provider>
    )
}