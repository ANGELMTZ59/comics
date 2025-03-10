import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaSearch,
  FaEye,
  FaCheck,
  FaTrash,
  FaBell,
  FaUserCircle,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles.css";

const Notificaciones = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

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
        asunto: "Promoción Especial",
        mensaje: "Aprovecha un 20% de descuento en tu próxima compra.",
        fecha: "2025-03-08",
        estado: "No leído",
      },
      {
        id: 2,
        asunto: "Recordatorio de Pago",
        mensaje: "Tu membresía expira pronto, renueva ahora.",
        fecha: "2025-03-07",
        estado: "Leído",
      },
      {
        id: 3,
        asunto: "Nuevo Evento",
        mensaje: "Evento exclusivo para miembros este fin de semana.",
        fecha: "2025-03-06",
        estado: "No leído",
      },
    ]);
  }, []);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  const markAsRead = (id) => {
    setNotificaciones(
      notificaciones.map((n) => (n.id === id ? { ...n, estado: "Leído" } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotificaciones(notificaciones.filter((n) => n.id !== id));
  };

  // 🔹 Función para abrir el modal de crear notificación
  const abrirModal = () => {
    setNotificacionForm({
      id_cliente: "",
      id_promocion: "",
      titulo: "",
      mensaje: "",
      leida: "no",
    });
    setModalVisible(true);
  };

  // 🔹 Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  const guardarNotificacion = () => {
    if (
      !notificacionForm.id_cliente ||
      !notificacionForm.titulo ||
      !notificacionForm.mensaje
    ) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    // Obtener nombre del cliente
    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id_cliente.toString() === notificacionForm.id_cliente
    );

    const nuevaNotificacion = {
      id: notificaciones.length + 1, // Asegurar ID único
      cliente: clienteSeleccionado ? clienteSeleccionado.nombre : "Desconocido",
      asunto: notificacionForm.titulo,
      mensaje: notificacionForm.mensaje,
      fecha: new Date().toISOString().split("T")[0], // Fecha actual
      estado: "No leído",
    };

    // Actualizar el estado asegurando la inmutabilidad
    setNotificaciones((prev) => [...prev, nuevaNotificacion]);

    // Cerrar el modal
    setModalAgregarVisible(false);
  };

  const showDetails = (notification) => {
    const cliente = clientes.find(
      (c) => c.id_cliente === notification.id_cliente
    );
    setSelectedNotification({
      ...notification,
      clienteNombre: cliente ? cliente.nombre : "Desconocido",
    });
    setModalVisible(true);
  };

  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  const abrirModalAgregar = () => {
    setNotificacionForm({
      id_cliente: "",
      id_promocion: "",
      titulo: "",
      mensaje: "",
      leida: "no",
    });
    setModalAgregarVisible(true);
  };

  return (
    <div className="notificaciones-page">
      <nav className="sidebar">
        <div className="logo-container">
          <img
            src="/images/logo.png"
            alt="Logo Comics Planet"
            className="logo"
          />
          <h2 className="sidebar-title">Comics Planet</h2>
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item" onClick={() => navigate("/inicioempleado")}>
            <FaHome className="icon" />
            <span className="menu-text">Inicio</span>
          </li>

          {/* Menú desplegable de Clientes */}
          <li className="menu-item" onClick={() => toggleSubmenu("clientes")}>
            <div className="menu-button">
              <FaShoppingCart className="icon" />
              <span className="menu-text">Clientes</span>
              {activeSubmenu === "clientes" ? (
                <FaChevronUp className="arrow-icon" />
              ) : (
                <FaChevronDown className="arrow-icon" />
              )}
            </div>
          </li>
          <ul
            className={`submenu ${
              activeSubmenu === "clientes" ? "visible" : ""
            }`}
          >
            <li onClick={() => navigate("/clientes")}>Lista de Clientes</li>
            <li onClick={() => navigate("/membresias")}>Membresías</li>
            <li onClick={() => navigate("/notificaciones")}>Notificaciones</li>
            <li onClick={() => navigate("/promociones")}>Promociones</li>
          </ul>

          {/* Menú de Inventarios */}
          <li
            className="menu-item"
            onClick={() => toggleSubmenu("inventarios")}
          >
            <div className="menu-button">
              <FaBoxOpen className="icon" />
              <span className="menu-text">Inventarios</span>
              {activeSubmenu === "inventarios" ? (
                <FaChevronUp className="arrow-icon" />
              ) : (
                <FaChevronDown className="arrow-icon" />
              )}
            </div>
          </li>
          <ul
            className={`submenu ${
              activeSubmenu === "inventarios" ? "visible" : ""
            }`}
          >
            <li onClick={() => navigate("/almacenes")}>Almacenes</li>
            <li onClick={() => navigate("/recepcion-de-mercancia")}>
              Recepción de Mercancía
            </li>
            <li onClick={() => navigate("/movimientos")}>Movimientos</li>
          </ul>

          {/* Proveedores */}
          <li
            className="menu-item"
            onClick={() => toggleSubmenu("proveedores")}
          >
            <div className="menu-button">
              <FaTruck className="icon" />
              <span className="menu-text">Proveedores</span>
              {activeSubmenu === "proveedores" ? (
                <FaChevronUp className="arrow-icon" />
              ) : (
                <FaChevronDown className="arrow-icon" />
              )}
            </div>
          </li>
          <ul
            className={`submenu ${
              activeSubmenu === "proveedores" ? "visible" : ""
            }`}
          >
            <li onClick={() => navigate("/gestion-proveedores")}>
              Gestión de Proveedores
            </li>
            <li onClick={() => navigate("/ordenes-de-compra")}>
              Órdenes de Compra
            </li>
          </ul>

          {/* Gestión de Empleados */}
          <li className="menu-item" onClick={() => toggleSubmenu("empleados")}>
            <div className="menu-button">
              <FaUsers className="icon" />
              <span className="menu-text">Gestión de Empleados</span>
              {activeSubmenu === "empleados" ? (
                <FaChevronUp className="arrow-icon" />
              ) : (
                <FaChevronDown className="arrow-icon" />
              )}
            </div>
          </li>
          <ul
            className={`submenu ${
              activeSubmenu === "empleados" ? "visible" : ""
            }`}
          >
            <li onClick={() => navigate("/gestion-empleados")}>Empleados</li>
          </ul>
        </ul>

        {/* Avatar en la esquina inferior */}
        <div className="user-profile" onClick={toggleMenuUsuario}>
          <FaUserCircle className="user-avatar" />
          <span className="user-name">{localEmpleado.nombre}</span>
        </div>
        {/* Menú desplegable del usuario */}
        {menuUsuarioVisible && (
          <div className={`user-menu ${menuUsuarioVisible ? "visible" : ""}`}>
            <p>
              <FaUserCircle /> {localEmpleado.nombre}
            </p>
            <p>
              <FaEnvelope /> {localEmpleado.correo}
            </p>
            <button className="logout-button">
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </div>
        )}
      </nav>

      <div className="notificaciones-container">
        {/* Encabezado */}
        <div className="titulo-y-boton">
          <h2>
            <FaBell className="icono-titulo" /> Gestión de Notificaciones
          </h2>
          <button className="btn-agregar" onClick={abrirModalAgregar}>
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
                    (n.cliente
                      ? n.cliente
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      : false) ||
                    (n.asunto
                      ? n.asunto
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      : false)
                )
                .map((n, index) => (
                  <tr key={n.id}>
                    <td>{index + 1}</td>
                    <td>{n.cliente || "Desconocido"}</td>
                    <td>{n.asunto || "Sin Asunto"}</td>
                    <td className="mensaje-columna">
                      {n.mensaje || "Sin Mensaje"}
                    </td>
                    <td>{n.fecha || "Sin Fecha"}</td>
                    <td>
                      <span
                        className={`estado ${
                          n.estado ? n.estado.toLowerCase() : "no-leido"
                        }`}
                      >
                        {n.estado || "No leído"}
                      </span>
                    </td>
                    <td className="acciones">
                      <button
                        className="btn-ver"
                        onClick={() => showDetails(n)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-leido"
                        onClick={() => markAsRead(n.id)}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => deleteNotification(n.id)}
                      >
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
