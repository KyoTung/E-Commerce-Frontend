import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../pages/authen/Login";
import RegisterForm from "../pages/authen/Register";
import GuestLayout from "../layouts/guest/Layout"
import Home from "../pages/guest/Home"
import About from "../pages/guest/About";
import Contact from "../pages/guest/Contact"
import ProductDetail from "../pages/guest/ProductDetail";
import Cart from "../pages/guest/Cart";
import Checkout from "../pages/guest/Checkout";

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
            },
            {
                path:"/product-detail",
                element:<ProductDetail/>
            },
            {
                path:"/cart",
                element:<Cart/>
            },
            {
                path:"/checkout",
                element:<Checkout/>
            }
        ]}
])