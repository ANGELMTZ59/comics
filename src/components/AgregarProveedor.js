import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClipboardList,
} from "react-icons/fa";
import "../styles.css";

const AgregarProveedor = () => {
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/proveedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proveedor),
    })
      .then(() => navigate("/gestion-proveedores"))
      .catch((err) => console.error("Error al agregar proveedor:", err));
  };

  return (
    <div className="proveedor-container">
      <div className="proveedor-form">
        <h2>
          <FaClipboardList className="form-icon" /> Agregar Proveedor
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-registrar">
            Registrar Proveedor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarProveedor;
