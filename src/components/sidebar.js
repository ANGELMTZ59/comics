import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  const empleado = JSON.parse(localStorage.getItem("empleado"));
  const idRol = empleado?.id_rol; // o null si no existe

  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("empleado");
    navigate("/login"); // redirige al login
  };

  return (
    <nav className="sidebar">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo Comics Planet" className="logo" />
        <h2 className="sidebar-title">Comics Planet</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item" onClick={() => navigate("/inicioempleado")}>
          <FaHome className="icon" />
          <span className="menu-text">Inicio</span>
        </li>

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
          className={`submenu ${activeSubmenu === "clientes" ? "visible" : ""}`}
        >
          <li onClick={() => navigate("/clientes")}>Lista de Clientes</li>
          <li onClick={() => navigate("/membresias")}>Membresías</li>
          <li onClick={() => navigate("/notificaciones")}>Notificaciones</li>
          <li onClick={() => navigate("/promociones")}>Promociones</li>
        </ul>

        <li className="menu-item" onClick={() => toggleSubmenu("inventarios")}>
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

        <li className="menu-item" onClick={() => toggleSubmenu("proveedores")}>
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

        {idRol === 3 && (
          <>
            <li
              className="menu-item"
              onClick={() => toggleSubmenu("empleados")}
            >
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
          </>
        )}
      </ul>

      <div className="user-profile" onClick={toggleMenuUsuario}>
        <FaUserCircle className="user-avatar" />
        <span className="user-name">{localEmpleado.nombre}</span>
      </div>
      {menuUsuarioVisible && (
        <div className={`user-menu ${menuUsuarioVisible ? "visible" : ""}`}>
          <p>
            <FaUserCircle /> {localEmpleado.nombre}
          </p>
          <p>
            <FaEnvelope /> {localEmpleado.correo}
          </p>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
