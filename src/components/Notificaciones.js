import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEye, FaCheck, FaTrash, FaBell } from "react-icons/fa";
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

  const [notificacionForm, setNotificacionForm] = useState({
    id_cliente: "",
    id_promocion: "",
    titulo: "",
    mensaje: "",
    leida: "no",
  });

  // 🔹 Clientes y Promociones simuladas para el prototipo
  const [clientes, setClientes] = useState([
    { id_cliente: 1, nombre: "Carlos López" },
    { id_cliente: 2, nombre: "María González" },
  ]);

  const [promociones, setPromociones] = useState([
    { id_promocion: 1, titulo: "Descuento 20%" },
    { id_promocion: 2, titulo: "Evento Exclusivo" },
  ]);

  // Simulación de notificaciones
  useEffect(() => {
    setNotificaciones([
      {
        id: 1,
        cliente: "Carlos López",
        asunto: "Promoción Especial",
        mensaje: "Aprovecha un 20% de descuento en tu próxima compra.",
        fecha: "2025-03-08",
        estado: "No leído",
      },
      {
        id: 2,
        cliente: "María González",
        asunto: "Recordatorio de Pago",
        mensaje: "Tu membresía expira pronto, renueva ahora.",
        fecha: "2025-03-07",
        estado: "Leído",
      },
      {
        id: 3,
        cliente: "Carlos López",
        asunto: "Nuevo Evento",
        mensaje: "Evento exclusivo para miembros este fin de semana.",
        fecha: "2025-03-06",
        estado: "No leído",
      },
    ]);
  }, []);

  const markAsRead = (id) => {
    setNotificaciones(
      notificaciones.map((n) => (n.id === id ? { ...n, estado: "Leído" } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotificaciones(notificaciones.filter((n) => n.id !== id));
  };

  const guardarNotificacion = () => {
    if (!notificacionForm.id_cliente || !notificacionForm.titulo || !notificacionForm.mensaje) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    // Obtener nombre del cliente
    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id_cliente.toString() === notificacionForm.id_cliente
    );

    const nuevaNotificacion = {
      id: notificaciones.length + 1,
      cliente: clienteSeleccionado ? clienteSeleccionado.nombre : "Desconocido",
      asunto: notificacionForm.titulo,
      mensaje: notificacionForm.mensaje,
      fecha: new Date().toISOString().split("T")[0],
      estado: "No leído",
    };

    setNotificaciones((prev) => [...prev, nuevaNotificacion]);
    setModalAgregarVisible(false);
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
          <button className="btn-agregar" onClick={() => setModalAgregarVisible(true)}>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones
                .filter(
                  (n) =>
                    (n.cliente ? n.cliente.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
                    (n.asunto ? n.asunto.toLowerCase().includes(searchTerm.toLowerCase()) : false)
                )
                .map((n, index) => (
                  <tr key={n.id}>
                    <td>{index + 1}</td>
                    <td>{n.cliente || "Desconocido"}</td>
                    <td>{n.asunto || "Sin Asunto"}</td>
                    <td className="mensaje-columna">{n.mensaje || "Sin Mensaje"}</td>
                    <td>{n.fecha || "Sin Fecha"}</td>
                    <td>
                      <span className={`estado ${n.estado ? n.estado.toLowerCase() : "no-leido"}`}>
                        {n.estado || "No leído"}
                      </span>
                    </td>
                    <td className="acciones">
                      <button className="btn-ver">
                        <FaEye />
                      </button>
                      <button className="btn-leido" onClick={() => markAsRead(n.id)}>
                        <FaCheck />
                      </button>
                      <button className="btn-eliminar" onClick={() => deleteNotification(n.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
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
            <button className="btn-cerrar" onClick={() => setModalAgregarVisible(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
