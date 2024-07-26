import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:4001')
            .then(res => {
                console.log("Server response:", res.data);
                if (res.data.Status === "Success") {
                    console.log("User authenticated: ", res.data.firstName);
                    setAuth(true);
                    setName(res.data.firstName);
                } else {
                    console.log("Authentication failed: ", res.data.Error);
                    setAuth(false);
                    alert(res.data.Error);
                }
            })
            .catch(err => {
                console.error("Error fetching auth status: ", err);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ auth, name, setAuth, setName }}>
            {children}
        </AuthContext.Provider>
    );
};
