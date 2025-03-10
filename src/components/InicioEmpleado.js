import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle,FaEdit } from "react-icons/fa";
import Sidebar from "./sidebar.js";
import "../styles.css";

const InicioEmpleado = ({ setEmpleado }) => {
  const navigate = useNavigate();
  const [localEmpleado, setLocalEmpleado] = useState(null);

  useEffect(() => {
    const empleadoSimulado = {
      nombre: "Juan Pérez",
      correo: "juanperez@example.com",
      puesto: "Administrador",
      usuario: "jperez",
      fechaNacimiento: "N/A",
      rol: "Administrador",
    };

    setLocalEmpleado(empleadoSimulado);
    if (setEmpleado) {
      setEmpleado(empleadoSimulado);
    }
  }, [setEmpleado]);

  if (!localEmpleado) return <div className="loading">Cargando...</div>;

  return (
    <div className="inicio-empleado">
      <Sidebar />
      <main className="main-content">
        <div className="perfil-container">
          <h2>
            <FaUserCircle /> Perfil de Usuario
          </h2>
          <div className="perfil-detalle">
            <div className="perfil-item">
              <strong>Nombre:</strong> {localEmpleado.nombre}
            </div>
            <div className="perfil-item">
              <strong>Usuario:</strong> {localEmpleado.usuario}
            </div>
            <div className="perfil-item">
              <strong>Puesto:</strong> {localEmpleado.puesto}
            </div>
            <div className="perfil-item">
              <strong>Fecha de Nacimiento:</strong> {localEmpleado.fechaNacimiento}
            </div>
            <div className="perfil-item">
              <strong>Email:</strong> {localEmpleado.correo}
            </div>
          </div>
          <button className="editar-button">
            <FaEdit /> Editar
          </button>
        </div>

        <div className="extra-container">
          <h2>Información Adicional</h2>
          <p>
            Aquí puedes agregar contenido extra como métricas, anuncios,
            estadísticas o cualquier otra información relevante.
          </p>
        </div>
      </main>
    </div>
  );
};

export default InicioEmpleado;