import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../pages/authen/Login";
import RegisterForm from "../pages/authen/Register";

export const router = createBrowserRouter([
     { path: "/login", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
])