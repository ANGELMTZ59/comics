import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaFileExcel,
  FaEdit,
  FaTrash,
  FaUserCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import "../styles.css";

const Clientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([
    {
      id_cliente: 1,
      nombre: "Carlos López",
      email: "carlos@example.com",
      telefono: "555-1234",
      direccion: "Av. Central 123",
      fecha_registro: "2024-01-15",
      nivel_membresia: "Gold",
    },
    {
      id_cliente: 2,
      nombre: "María González",
      email: "maria@example.com",
      telefono: "555-5678",
      direccion: "Calle 45 #89",
      fecha_registro: "2023-12-10",
      nivel_membresia: "Platinum",
    },
    {
      id_cliente: 3,
      nombre: "Juan Pérez",
      email: "juanp@example.com",
      telefono: "555-8765",
      direccion: "Colonia Vista Alegre",
      fecha_registro: "2022-11-20",
      nivel_membresia: "Regular",
    },
    {
      id_cliente: 4,
      nombre: "Ana Ramírez",
      email: "ana@example.com",
      telefono: "555-3344",
      direccion: "Boulevard Sur 45",
      fecha_registro: "2024-02-05",
      nivel_membresia: "Gold",
    },
  ]);

  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);

  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  return (
    <div className="clientes-page">
      {/* Barra de navegación */}
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

      <div className="clientes-container">
        {/* Sección de encabezado con título y botones */}
        <div className="header-clientes">
          <h2>📜 Gestión de Clientes</h2>
          <div className="botones-clientes">
            <button className="btn-agregar">
              <FaPlus /> Agregar Cliente
            </button>
            <button className="btn-exportar">
              <FaFileExcel /> Exportar a Excel
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="buscador">
          <FaSearch className="icono-busqueda" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o membresía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla */}
        <div className="tabla-container">
          <table className="clientes-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Registro</th>
                <th>Membresía</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes
                .filter(
                  (cliente) =>
                    cliente.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    cliente.email
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    cliente.nivel_membresia
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((cliente, index) => (
                  <tr key={cliente.id_cliente}>
                    <td>{index + 1}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.direccion}</td>
                    <td>{cliente.fecha_registro}</td>
                    <td>{cliente.nivel_membresia}</td>
                    <td className="acciones">
                      <button className="btn-editar">
                        <FaEdit />
                      </button>
                      <button className="btn-eliminar">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
