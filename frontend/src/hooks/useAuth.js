import { signIn } from "../api/authApi"

export const useAuth = () => {
    const login = async (email, password) => {
        const res = await signIn({ email, password })

        localStorage.setItem("token", res.data.token)
    }

    return { login }
}