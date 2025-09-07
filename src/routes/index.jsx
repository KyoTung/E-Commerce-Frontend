import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../pages/authen/Login";
import RegisterForm from "../pages/authen/Register";
import GuestLayout from "../layouts/guest/Layout"
import Home from "../pages/guest/Home"
import About from "../pages/guest/About";
import Contact from "../pages/guest/Contact"

export const router = createBrowserRouter([
     { path: "/login", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
    {path:"/", element: <GuestLayout/>,
        children:[
            {
                index: true,
                element: <Home />,
            },   
            {
                path: "/about",
                element: <About/>
            },
            {
                path:"/contact",
                element: <Contact/>
            }
        ]}
])