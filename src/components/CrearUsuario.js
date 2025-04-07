import React, { useState } from "react";
import axios from "axios";
import "../clientes.css";

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/clientes", {
        nombre: formData.nombre,
        email: formData.correo,
        contraseña: formData.contrasena, // Use 'contraseña' to match the backend
        telefono: formData.telefono,
        direccion: formData.direccion,
        nivel_membresia: "regular", // Default membership level
        frecuencia_compra: "baja", // Default purchase frequency
      });

      if (response.data && response.data.success) {
        alert("Usuario registrado exitosamente.");
        console.log("Registro exitoso:", response.data);
        setFormData({
          nombre: "",
          correo: "",
          contrasena: "",
          telefono: "",
          direccion: "",
        });
      } else {
        throw new Error(response.data?.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert(`Error: ${error.response?.data?.message || "Error desconocido"}`);
    }
  };

  return (
    <div className="crear-usuario-page">
      <div className="form-wrapper">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
          />
          <button type="submit" className="btn-submit">
            Crear Cuenta
          </button>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <a href="/iniciar-sesion">Inicia sesión aquí.</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
