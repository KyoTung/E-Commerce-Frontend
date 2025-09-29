const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";

const login = async(userData) =>{
    const reponse = await axios.post(`${baseURL}/user/login`, userData);
    console.log(reponse)
}

const authService = {
    login,
}

export default authService;