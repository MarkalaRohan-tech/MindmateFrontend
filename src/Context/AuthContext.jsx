import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider =({ children })=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);

          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setUser(null);
          } else {
            setUser(decoded);
          }
        } catch (error) {
          console.log("Invalid Token");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }, []);


    const login = async (email, password) => {
      const res = await axios.post("/api/user/login", { email, password });
      const token = res.data.token;

      if (token) {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser(decoded);
      }

      return res.data; // instead of just returning token
    };


    const register = async (fullname, email, password, username, phone) => {
      const res = await axios.post("/api/user/register", {
        fullname,
        email,
        password,
        username,
        phone,
      });

      return res.data;
    };

    const logout = () => {
      localStorage.removeItem("token");
      setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);