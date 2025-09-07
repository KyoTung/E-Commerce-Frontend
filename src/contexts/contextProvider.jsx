import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    logout: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("CURRENT_USER");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setTokenState] = useState(localStorage.getItem("ACCESS_TOKEN"));

    // Đảm bảo token luôn được lưu/clear đúng localStorage
    const setToken = (token) => {
        setTokenState(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    // Đảm bảo user luôn được lưu/clear đúng localStorage
    useEffect(() => {
        if (user && token) {
            localStorage.setItem("CURRENT_USER", JSON.stringify(user));
        } else {
            localStorage.removeItem("CURRENT_USER");
        }
    }, [user]);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("CURRENT_USER");
        localStorage.removeItem("ACCESS_TOKEN");
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                logout,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
