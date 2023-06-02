import { createContext, useContext, useEffect, useState } from "react";

const User = createContext({
    // user:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
});

const Context = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

    useEffect(() => {
        localStorage.setItem('userInfo', JSON.stringify(user))
    }, [user])

    return (
        <User.Provider value={{ user, setUser }}>
            {children}
        </User.Provider>
    );
};

export const UserState = () => {
    return useContext(User);
};

export default Context;