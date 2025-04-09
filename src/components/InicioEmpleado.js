import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import Sidebar from "./sidebar.js";
import axios from "axios";
import "../styles.css";

const API_URL = "https://fastapi-my17.onrender.com/api";

const InicioEmpleado = ({ setEmpleado }) => {
  const navigate = useNavigate();
  const [localEmpleado, setLocalEmpleado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [empleadoEditado, setEmpleadoEditado] = useState({});
  const [puestos, setPuestos] = useState([]);

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No se encontró un token. Redirigiendo al login...");
          navigate("/login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:5000/api/empleado",
          config
        );

        if (response.data.success) {
          setLocalEmpleado(response.data.empleado); // ✅ Guarda el empleado
          setEmpleadoEditado({
            nombre: response.data.empleado.nombre_usuario,
            email: response.data.empleado.email,
            telefono: response.data.empleado.telefono,
            puesto: response.data.empleado.puesto,
          });
        }
      } catch (error) {
        console.error("❌ Error al obtener el empleado:", error);
        if (error.response && error.response.status === 401) {
          console.error(
            "❌ Token inválido o expirado. Redirigiendo al login..."
          );
          navigate("/login");
        }
      }
    };

    const fetchPuestos = async () => {
      try {
        const response = await axios.get(`${API_URL}/puestos`);
        console.log("📊 Puestos recibidos:", response.data); // 🔹 Imprime la respuesta
        if (response.data.success) {
          setPuestos(response.data.puestos);
        } else {
          console.warn("⚠ No se encontraron puestos");
        }
      } catch (error) {
        console.error("❌ Error al obtener los puestos:", error);
      }
    };

    fetchEmpleado();
    fetchPuestos();
  }, [navigate]);

  const formatFecha = (fecha) => {
    return fecha
      ? new Date(fecha).toISOString().split("T")[0]
      : "No disponible";
  };

  const formatTelefono = (telefono) => {
    return telefono ? telefono.replace("+52", "").trim() : "No disponible";
  };

  const handleEditar = () => {
    setEditando(true);
    setEmpleadoEditado({ ...localEmpleado });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = async () => {
    try {
      if (!localEmpleado || !localEmpleado.id_empleado) {
        alert("❌ No se encontró el ID del empleado.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/empleado/${localEmpleado.id_empleado}`,
        empleadoEditado
      );

      if (response.data.success) {
        alert("✅ Información actualizada correctamente");
        setEditando(false);
        setLocalEmpleado((prev) => ({
          ...prev,
          ...empleadoEditado,
        }));
      } else {
        alert("❌ Ocurrió un error al actualizar");
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

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
              <strong>Nombre:</strong>
              {editando ? (
                <input
                  type="text"
                  name="nombre"
                  value={empleadoEditado.nombre}
                  onChange={handleChange}
                  className="input-edit"
                />
              ) : (
                localEmpleado.nombre_usuario
              )}
            </div>

            <div className="perfil-item">
              <strong>Puesto:</strong>
              {editando ? (
                puestos.length > 0 ? (
                  <select
                    name="puesto"
                    value={empleadoEditado.puesto}
                    onChange={handleChange}
                    className="input-edit"
                  >
                    {puestos.map((p) => (
                      <option key={p.id_rol} value={p.nombre_rol}>
                        {p.nombre_rol}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>No hay puestos disponibles</span>
                )
              ) : (
                localEmpleado.puesto
              )}
            </div>

            <div className="perfil-item">
              <strong>Fecha de Contratación:</strong>{" "}
              {formatFecha(localEmpleado.fecha_contratacion)}
            </div>

            <div className="perfil-item">
              <strong>Email:</strong>
              {editando ? (
                <input
                  type="email"
                  name="email"
                  value={empleadoEditado.email}
                  onChange={handleChange}
                  className="input-edit"
                />
              ) : (
                localEmpleado.email
              )}
            </div>

            <div className="perfil-item">
              <strong>Teléfono:</strong>
              {editando ? (
                <input
                  type="text"
                  name="telefono"
                  value={formatTelefono(empleadoEditado.telefono)}
                  onChange={handleChange}
                  className="input-edit"
                />
              ) : (
                formatTelefono(localEmpleado.telefono)
              )}
            </div>
          </div>

          {editando ? (
            <>
              <button className="guardar-button" onClick={handleGuardar}>
                <span role="img" aria-label="guardar">
                  ✅
                </span>{" "}
                Guardar
              </button>

              <button
                className="cancelar-button"
                onClick={() => setEditando(false)}
              >
                ❌ Cancelar
              </button>
            </>
          ) : (
            <button className="editar-button" onClick={handleEditar}>
              <FaEdit /> Editar
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default InicioEmpleado;
