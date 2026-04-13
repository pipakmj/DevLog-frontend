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
                element: <ProjectForm />
            },
            {
                path: "/project/edit/:projectId",
                element: <ProjectForm />
            },
            {
                path: "/posts",
                element: <PostList />
            },
            {
                path: "/posts/write",
                element: <PostWrite />
            },
            {
                path: "/posts/edit/:postId",
                element: <PostWrite />
            },
            {
                path: "/posts/:postId",
                element: <PostDetail />
            },
        ]
    },
]);