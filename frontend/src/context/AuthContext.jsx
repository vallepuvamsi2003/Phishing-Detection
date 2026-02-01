
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Auth init error:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Helper to permit access anyway on failure
    const grantPermissiveAccess = (userData) => {
        const fallbackUser = {
            id: 'permissive_guest_' + Date.now(),
            email: userData.email || 'guest@example.com',
            fullName: userData.fullName || userData.email?.split('@')[0] || 'Guest User',
            role: 'admin', // Grant admin access as requested
            avatar: userData.avatar || null
        };
        console.warn("Authentication failed or fallback triggered. Granting permissive access.", fallbackUser);

        localStorage.setItem('token', 'permissive_dummy_token');
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return fallbackUser;
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error("Login failed, granting permissive access:", error);
            // On failure, allow access anyway with the provided email
            return grantPermissiveAccess({ email });
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/signup', { fullName: name, email, password });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error("Signup failed, granting permissive access:", error);
            // On failure, allow access anyway with provided details
            return grantPermissiveAccess({ fullName: name, email });
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async (credential) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/google', { token: credential });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error("Google Login failed, granting permissive access:", error);
            // Try to decode the credential to get user info if possible, otherwise generic guest
            try {
                const decoded = jwtDecode(credential);
                return grantPermissiveAccess({
                    email: decoded.email,
                    fullName: decoded.name,
                    avatar: decoded.picture
                });
            } catch (e) {
                return grantPermissiveAccess({ email: 'google_guest@example.com' });
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
