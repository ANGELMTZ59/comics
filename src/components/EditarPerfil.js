import React, { useState, useEffect } from "react";
import axios from "axios";
import "../clientes.css";

const EditarPerfil = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const [cliente, setCliente] = useState(() => {
    const storedCliente = localStorage.getItem("cliente");
    return storedCliente ? JSON.parse(storedCliente) : null;
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente || !cliente.id_cliente) {
      alert("No se encontró información del cliente.");
      return;
    }

    // Validar campos requeridos antes de enviar
    if (!formData.nombre || !formData.email) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/clientes/${cliente.id_cliente}`,
        formData
      );

      if (response.data.success) {
        const updatedCliente = { ...cliente, ...response.data.cliente };
        localStorage.setItem("cliente", JSON.stringify(updatedCliente));
        alert("Perfil actualizado con éxito.");
        window.location.href = "/productos";
      } else {
        alert("Error al actualizar el perfil. Verifica los datos ingresados.");
      }
    } catch (error) {
      console.error("❌ Error al actualizar el perfil:", error);
      alert("Error al actualizar el perfil. Verifica los datos ingresados.");
    }
  };

  return (
    <div className="editar-perfil-page">
      <div className="form-wrapper">
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
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
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;
