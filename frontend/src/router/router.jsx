import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import MyPage from "../pages/MyPage";
import ProjectList from "../pages/ProjectList";
import ProjectDetail from "../pages/ProjectDetail";
import ProjectForm from "../pages/ProjectForm";
import PostList from "../pages/PostList";
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";
import ProtectedRoute from "../components/ProtectedRoute";
import FindPassword from "../pages/FindPassword";
import ResetPassword from "../pages/ResetPassword";
import Terms from "../pages/Terms";
import TechTrends from "../pages/TechTrends";

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
                path: "/forgot-password",
                element: <FindPassword />
            },
            {
                path: "/passwordreset",
                element: <ResetPassword />
            },
            {
                path: "/mypage",
                element: <ProtectedRoute><MyPage /></ProtectedRoute>
            },
            {
                path: "/projectlist",
                element: <ProjectList />
            },
            {
                path: "/project/:projectId",
                element: <ProjectDetail />
            },
            {
                path: "/project/add",
                element: <ProtectedRoute><ProjectForm /></ProtectedRoute>
            },
            {
                path: "/project/edit/:projectId",
                element: <ProtectedRoute><ProjectForm /></ProtectedRoute>
            },
            {
                path: "/posts",
                element: <PostList />
            },
            {
                path: "/posts/write",
                element: <ProtectedRoute><PostWrite /></ProtectedRoute>
            },
            {
                path: "/posts/edit/:postId",
                element: <ProtectedRoute><PostWrite /></ProtectedRoute>
            },
            {
                path: "/posts/:postId",
                element: <PostDetail />
            },
            {
                path: "/terms",
                element: <Terms />
            },
            {
                path: "/trends",
                element: <TechTrends />
            },
        ]
    },
]);