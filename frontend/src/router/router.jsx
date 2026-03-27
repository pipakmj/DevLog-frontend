import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import MyPage from "../pages/MyPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/signin",
                element: <Signin />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/mypage",
                element: <MyPage />
            },
        ]
    },
]);