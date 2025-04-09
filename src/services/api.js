import axios from "axios";

const API_URL = "https://fastapi-my17.onrender.com/api"; // updated URL

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.success) {
      localStorage.setItem("token", response.data.token); // Guardar token
    }
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { success: false, error: "Error en el servidor" };
  }
};

// Función para obtener datos del usuario autenticado
export const getUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return null;
  }
};

// Función para cerrar sesión (eliminar token)
export const logout = () => {
  localStorage.removeItem("token");
};
