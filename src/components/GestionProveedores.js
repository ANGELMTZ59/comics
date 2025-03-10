import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaSignOutAlt,
  FaEnvelope,
  FaEdit,
  FaTimes,
  FaUsers,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaClipboardList,
} from "react-icons/fa";
import "../styles.css";

const GestionProveedores = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);

  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

  useEffect(() => {
    // Datos de prueba para visualizar la tabla
    setProveedores([
      {
        id_proveedor: 1,
        nombre: "Marvel Comics",
        email: "contacto@marvel.com",
        telefono: "555-1234",
        direccion: "Av. Superhéroes 123",
        fecha_ultimo_abastecimiento: "2025-02-20",
      },
      {
        id_proveedor: 2,
        nombre: "DC Comics",
        email: "contacto@dc.com",
        telefono: "555-5678",
        direccion: "Gotham 456",
        fecha_ultimo_abastecimiento: "2025-02-22",
      },
      {
        id_proveedor: 3,
        nombre: "Hasbro",
        email: "ventas@hasbro.com",
        telefono: "555-9876",
        direccion: "Juguetes 789",
        fecha_ultimo_abastecimiento: "2025-02-25",
      },
    ]);
  }, []);

  const handleChange = (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProveedores([
      ...proveedores,
      {
        ...nuevoProveedor,
        id_proveedor: proveedores.length + 1,
        fecha_ultimo_abastecimiento: "N/A",
      },
    ]);
    setModalOpen(false);
    setNuevoProveedor({ nombre: "", email: "", telefono: "", direccion: "" });
  };

  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProveedores(
      proveedores.map((p) =>
        p.id_proveedor === proveedorSeleccionado.id_proveedor
          ? proveedorSeleccionado
          : p
      )
    );
    setEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    setProveedorSeleccionado({
      ...proveedorSeleccionado,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  useEffect(() => {
    fetch("http://localhost:5000/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("Error al obtener proveedores:", err));
  }, []);

  const eliminarProveedor = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      fetch(`http://localhost:5000/proveedores/${id}`, {
        method: "DELETE",
      })
        .then(() =>
          setProveedores(proveedores.filter((p) => p.id_proveedor !== id))
        )
        .catch((err) => console.error("Error al eliminar proveedor:", err));
    }
  };
  return (
    <div className="proveedores-page">
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
            <FaHome className="icon" />{" "}
            <span className="menu-text">Inicio</span>
          </li>

          {/* Menú desplegable de Clientes */}
          <li className="menu-item" onClick={() => toggleSubmenu("clientes")}>
            <div className="menu-button">
              <FaShoppingCart className="icon" />{" "}
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

          {/* Menú desplegable de Inventarios */}
          <li
            className="menu-item"
            onClick={() => toggleSubmenu("inventarios")}
          >
            <div className="menu-button">
              <FaBoxOpen className="icon" />{" "}
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
            <li onClick={() => navigate("/movimientos")}>Movimientos</li>{" "}
            {/* 🔹 Nuevo apartado agregado */}
          </ul>

          {/* Proveedores */}
          <li
            className="menu-item"
            onClick={() => toggleSubmenu("proveedores")}
          >
            <div className="menu-button">
              <FaTruck className="icon" />{" "}
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
            </li>{" "}
            {/* 🔹 Nuevo apartado agregado */}
          </ul>

          {/* 🔹 Gestión de Empleados */}
          <li className="menu-item" onClick={() => toggleSubmenu("empleados")}>
            <div className="menu-button">
              <FaUsers className="icon" />{" "}
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
            <li
              onClick={() => {
                console.log("Redirigiendo a Gestión de Empleados");
                navigate("/gestion-empleados");
              }}
            >
              Empleados
            </li>
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

      <div className="proveedores-header">
        <h2>📋 Gestión de Proveedores</h2>
        <button className="btn-agregar" onClick={() => setModalOpen(true)}>
          <FaPlus /> Agregar Proveedor
        </button>
      </div>

      {/* Modal para agregar proveedor */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setModalOpen(false)}>
              <FaTimes />
            </button>
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
      )}

      <div className="table-wrapper">
        <div className="proveedores-container">
          <table className="proveedores-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Último Abastecimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor, index) => (
                <tr key={proveedor.id_proveedor}>
                  <td>{index + 1}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.email}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.direccion}</td>
                  <td>{proveedor.fecha_ultimo_abastecimiento || "N/A"}</td>
                  <td className="acciones">
                    <button
                      className="btn-accion editar"
                      onClick={() => handleEditClick(proveedor)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarProveedor(proveedor.id_proveedor)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para agregar proveedor */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {/* 📌 Cabecera del Modal */}
              <div className="modal-header">
                <h2>Agregar Proveedor</h2>
                <button
                  className="close-modal"
                  onClick={() => setModalOpen(false)}
                >
                  ✖
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={nuevoProveedor.nombre}
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
                    value={nuevoProveedor.email}
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
                    value={nuevoProveedor.telefono}
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
                    value={nuevoProveedor.direccion}
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
        )}
      </div>
    </div>
  );
};

export default GestionProveedores;
