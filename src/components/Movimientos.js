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
  FaSearch,
  FaUsers,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles.css";

const Movimientos = () => {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [movimientos, setMovimientos] = useState([
    {
      id_movimiento: 1,
      tipo_movimiento: "entrada",
      producto: "Cómic Batman #100",
      cantidad: 10,
      empleado: "Juan Pérez",
      fecha_movimiento: "2025-03-05",
    },
    {
      id_movimiento: 2,
      tipo_movimiento: "salida",
      producto: "Manga One Piece Vol. 50",
      cantidad: 5,
      empleado: "María López",
      fecha_movimiento: "2025-03-04",
    },
  ]);

  const [movimientoForm, setMovimientoForm] = useState({
    tipo_movimiento: "entrada",
    producto: "",
    cantidad: "",
    empleado: "",
  });

  const abrirModal = (movimiento = null) => {
    if (movimiento) {
      setMovimientoForm(movimiento);
      setEditando(true);
    } else {
      setMovimientoForm({
        tipo_movimiento: "entrada",
        producto: "",
        cantidad: "",
        empleado: "",
      });
      setEditando(false);
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(false);
  };

  const guardarMovimiento = () => {
    if (
      !movimientoForm.producto ||
      !movimientoForm.cantidad ||
      !movimientoForm.empleado
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (editando) {
      setMovimientos(
        movimientos.map((m) =>
          m.id_movimiento === movimientoForm.id_movimiento ? movimientoForm : m
        )
      );
    } else {
      setMovimientos([
        ...movimientos,
        {
          ...movimientoForm,
          id_movimiento: movimientos.length + 1,
          fecha_movimiento: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    cerrarModal();
  };

  const eliminarMovimiento = (id_movimiento) => {
    if (window.confirm("¿Seguro que deseas eliminar este movimiento?")) {
      setMovimientos(
        movimientos.filter((m) => m.id_movimiento !== id_movimiento)
      );
    }
  };

  const movimientosFiltrados = movimientos.filter((m) =>
    m.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Alternar Submenús
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // 🔹 Alternar Menú de Usuario
  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

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

      <main className="main-content">
        <div className="header-container">
          <h2>📦 Registro de Movimientos</h2>
          <button className="btn-agregar" onClick={() => abrirModal()}>
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
              {movimientosFiltrados.map((mov) => (
                <tr key={mov.id_movimiento}>
                  <td>{mov.tipo_movimiento}</td>
                  <td>{mov.producto}</td>
                  <td>{mov.cantidad}</td>
                  <td>{mov.empleado}</td>
                  <td>{mov.fecha_movimiento}</td>
                  <td>
                    <button onClick={() => abrirModal(mov)}>
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => eliminarMovimiento(mov.id_movimiento)}
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
