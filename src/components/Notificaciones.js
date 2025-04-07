import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaCheck,
  FaTrash,
  FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styless.css";
import Sidebar from "./sidebar"; // ✅ Importación del Sidebar

const Notificaciones = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [promociones, setPromociones] = useState([]);

  const [notificacionForm, setNotificacionForm] = useState({
    id_cliente: "",
    id_promocion: "",
    titulo: "",
    mensaje: "",
    leida: "no",
  });

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/notificaciones"
        );
        if (response.data.success) {
          setNotificaciones(response.data.notificaciones);
          console.log(
            "📨 Notificaciones cargadas:",
            response.data.notificaciones
          );
        }
      } catch (error) {
        console.error("❌ Error al obtener notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener clientes
        const clientesResponse = await axios.get(
          "http://localhost:5000/api/clientes"
        );
        if (clientesResponse.data.success) {
          setClientes(clientesResponse.data.clientes);
        }

        // Obtener promociones
        const promocionesResponse = await axios.get(
          "http://localhost:5000/api/promociones"
        );
        if (promocionesResponse.data.success) {
          setPromociones(promocionesResponse.data.promociones);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const markAsRead = (id) => {
    setNotificaciones(
      notificaciones.map((n) => (n.id === id ? { ...n, estado: "Leído" } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotificaciones(notificaciones.filter((n) => n.id !== id));
  };

  const guardarNotificacion = async () => {
    if (
      !notificacionForm.id_cliente ||
      !notificacionForm.titulo ||
      !notificacionForm.mensaje
    ) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    try {
      console.log("📤 Enviando datos al backend:", notificacionForm); // Log para depuración
      const response = await axios.post(
        "http://localhost:5000/api/notificaciones",
        {
          ...notificacionForm,
          fecha_envio: new Date().toISOString().split("T")[0],
        }
      );

      if (response.data.success) {
        alert("✅ Notificación agregada correctamente");

        // Actualiza la lista para que aparezca la nueva notificación
        setNotificaciones((prev) => [...prev, response.data.notificacion]);
        setModalAgregarVisible(false);
      } else {
        alert("❌ No se pudo agregar la notificación");
      }
    } catch (error) {
      console.error("❌ Error al guardar notificación:", error);
      alert("❌ Error en el servidor");
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/notificaciones/${id}/leida`
      );

      if (response.data.success) {
        // Actualiza la notificación en el estado
        setNotificaciones((prev) =>
          prev.map((n) =>
            n.id_notificacion === id ? { ...n, leida: "si" } : n
          )
        );
      } else {
        alert("❌ No se pudo marcar como leída");
      }
    } catch (error) {
      console.error("❌ Error al marcar como leída:", error);
      alert("❌ Error al actualizar");
    }
  };

  const eliminarNotificacion = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta notificación?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/notificaciones/${id}`
      );

      if (response.data.success) {
        setNotificaciones((prev) =>
          prev.filter((n) => n.id_notificacion !== id)
        );
        alert("✅ Notificación eliminada");
      } else {
        alert("❌ No se pudo eliminar la notificación");
      }
    } catch (error) {
      console.error("❌ Error al eliminar notificación:", error);
      alert("❌ Error en el servidor");
    }
  };

  return (
    <div className="notificaciones-page">
      <Sidebar /> {/* ✅ Sidebar importado y agregado */}
      <div className="notificaciones-container">
        {/* Encabezado */}
        <div className="titulo-y-boton">
          <h2>
            <FaBell className="icono-titulo" /> Gestión de Notificaciones
          </h2>
          <button
            className="btn-agregar"
            onClick={() => setModalAgregarVisible(true)}
          >
            <FaPlus /> Crear Notificación
          </button>
        </div>

        {/* Buscador */}
        <div className="buscador">
          <FaSearch className="icono-busqueda" />
          <input
            type="text"
            placeholder="Buscar por cliente, asunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Contenedor de la tabla */}
        <div className="tabla-container">
          <table className="notificaciones-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones.length > 0 ? (
                notificaciones.map((n, index) => (
                  <tr key={n.id_notificacion}>
                    <td>{index + 1}</td>
                    <td>{n.nombre_cliente}</td>
                    <td>{n.titulo}</td>
                    <td>{n.mensaje}</td>
                    <td>
                      {new Date(n.fecha_envio).toISOString().split("T")[0]}
                    </td>
                    <td className="acciones">
                      {n.leida === "no" && (
                        <button
                          className="btn-marcar"
                          onClick={() => marcarComoLeida(n.id_notificacion)}
                        >
                          <FaCheck />
                        </button>
                      )}
                      {n.leida === "si" && (
                        <button
                          className="btn-eliminar"
                          onClick={() =>
                            eliminarNotificacion(n.id_notificacion)
                          }
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">⚠ No hay notificaciones disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {modalAgregarVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Crear Notificación</h3>
            <label>Cliente:</label>
            <select
              value={notificacionForm.id_cliente}
              onChange={(e) =>
                setNotificacionForm({
                  ...notificacionForm,
                  id_cliente: e.target.value,
                })
              }
            >
              <option value="">Seleccione un Cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre}
                </option>
              ))}
            </select>

            <label>Promoción:</label>
            <select
              value={notificacionForm.id_promocion}
              onChange={(e) =>
                setNotificacionForm({
                  ...notificacionForm,
                  id_promocion: e.target.value,
                })
              }
            >
              <option value="">Seleccione una Promoción</option>
              {promociones.map((promo) => (
                <option key={promo.id_promocion} value={promo.id_promocion}>
                  {promo.titulo}
                </option>
              ))}
            </select>

            <label>Título:</label>
            <input
              type="text"
              value={notificacionForm.titulo}
              onChange={(e) =>
                setNotificacionForm({
                  ...notificacionForm,
                  titulo: e.target.value,
                })
              }
            />

            <label>Mensaje:</label>
            <textarea
              value={notificacionForm.mensaje}
              onChange={(e) =>
                setNotificacionForm({
                  ...notificacionForm,
                  mensaje: e.target.value,
                })
              }
            ></textarea>

            <button className="btn-guardar" onClick={guardarNotificacion}>
              Guardar
            </button>
            <button
              className="btn-cerrar"
              onClick={() => setModalAgregarVisible(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
