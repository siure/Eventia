import api from "./api";

export const login = async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post("/users/register", {email, password, name});
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("auth-change"));
};

export const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

export const updateProfile = async (updates) => {
    const response = await api.put("/users/profile", updates);
    return response.data;
};