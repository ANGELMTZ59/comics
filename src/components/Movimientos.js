import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers, // 🔹 Asegúrate de importar FaUsers
  FaEnvelope, // 🔹 Asegúrate de importar FaEnvelope
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles.css";

const Movimientos = () => {
  // 📌 La función está correctamente definida aquí
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);
  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      tipo: "Entrada",
      producto: "Cómic Batman #100",
      cantidad: 10,
      empleado: "Juan Pérez",
      fecha: "2025-03-05",
    },
    {
      id: 2,
      tipo: "Salida",
      producto: "Manga One Piece Vol. 50",
      cantidad: 5,
      empleado: "María López",
      fecha: "2025-03-04",
    },
  ]);

  const [empleado, setEmpleado] = useState({
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  });

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  const handleEliminar = (id) => {
    const confirmacion = window.confirm(
      "¿Seguro que deseas eliminar este movimiento?"
    );
    if (confirmacion) {
      setMovimientos(movimientos.filter((mov) => mov.id !== id));
    }
  };

  const [localEmpleado, setLocalEmpleado] = useState({
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  });

  return (
    // 📌 EL RETURN DEBE ESTAR DENTRO DE LA FUNCIÓN Movimientos()
    <div className="movimientos-page">
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

      {/* Contenido principal */}
      <main className="main-content">
        <div className="header-container">
          <h2>📦 Registro de Movimientos</h2>
          <button className="btn-agregar" onClick={() => setModalOpen(true)}>
            <FaPlus /> Agregar Movimiento
          </button>
        </div>

        {/* Tabla de movimientos */}
        <div className="table-wrapper">
          <table className="movimientos-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Empleado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td>{mov.tipo}</td>
                  <td>{mov.producto}</td>
                  <td>{mov.cantidad}</td>
                  <td>{mov.empleado}</td>
                  <td>{mov.fecha}</td>
                  <td className="acciones">
                    <button className="btn-accion editar">
                      <FaEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => handleEliminar(mov.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Movimientos;
