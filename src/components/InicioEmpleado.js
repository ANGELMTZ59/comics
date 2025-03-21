import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import Sidebar from "./sidebar.js";
import axios from "axios";
import "../styles.css";

const API_URL = "http://localhost:5000/api";

const InicioEmpleado = ({ setEmpleado }) => {
  const navigate = useNavigate();
  const [localEmpleado, setLocalEmpleado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [empleadoEditado, setEmpleadoEditado] = useState({});
  const [puestos, setPuestos] = useState([]);

  useEffect(() => {
    const fetchEmpleado = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/empleado`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📊 Datos recibidos del backend:", response.data);

        if (response.data.success) {
          setLocalEmpleado(response.data.empleado);
          setEmpleadoEditado(response.data.empleado);
        } else {
          console.warn("⚠ No se encontró información del empleado");
        }
      } catch (error) {
        console.error("❌ Error al obtener el empleado:", error);
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
  };

  const handleChange = (e) => {
    setEmpleadoEditado({
      ...empleadoEditado,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No tienes permisos para editar.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/empleado/${empleadoEditado.id_empleado}`, // ✅ Se usa el ID en la URL
        {
          email: empleadoEditado.email,
          puesto: empleadoEditado.puesto,
          telefono: empleadoEditado.telefono,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setLocalEmpleado(empleadoEditado);
        setEditando(false);
        alert("✅ Cambios guardados correctamente");
      } else {
        alert("❌ Error al actualizar los datos");
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("❌ Error en el servidor");
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
              <strong>Nombre:</strong>{" "}
              {localEmpleado?.nombre_usuario || "No disponible"}
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
