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
  FaTimes,
} from "react-icons/fa";
import * as XLSX from "xlsx";
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
  ]);

  const [membresias, setMembresias] = useState([
    {
      id_membresia: 1,
      id_cliente: 1,
      nivel: "Gold",
      fecha_inicio: "2024-01-15",
      fecha_fin: "2025-01-15",
      beneficios: "Descuento en compras",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    nivel_membresia: "regular",
    frecuencia_compra: "baja",
  });

  // 🟢 ABRIR MODAL PARA AGREGAR CLIENTE
  const abrirModalAgregar = () => {
    setEditingClient(null);
    setClienteForm({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      nivel_membresia: "regular",
      frecuencia_compra: "baja",
    });
    setModalVisible(true);
  };

  // 🟢 ABRIR MODAL PARA EDITAR CLIENTE
  const abrirModalEditar = (cliente) => {
    setEditingClient(cliente);
    setClienteForm({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      nivel_membresia: cliente.nivel_membresia,
      frecuencia_compra: cliente.frecuencia_compra,
    });
    setModalVisible(true);
  };

  // 🔴 CERRAR MODAL
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // ✅ GUARDAR CLIENTE
  const guardarCliente = () => {
    if (
      !clienteForm.nombre ||
      !clienteForm.email ||
      !clienteForm.telefono ||
      !clienteForm.direccion
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (editingClient) {
      // Editar cliente existente
      setClientes(
        clientes.map((c) =>
          c.id_cliente === editingClient.id_cliente
            ? { ...c, ...clienteForm }
            : c
        )
      );
    } else {
      // Agregar nuevo cliente
      const id_cliente = clientes.length + 1;
      setClientes([
        ...clientes,
        {
          ...clienteForm,
          id_cliente,
          fecha_registro: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    cerrarModal();
  };

  // ❌ ELIMINAR CLIENTE
  const eliminarCliente = (id_cliente) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que quieres eliminar este cliente?"
    );
    if (confirmacion) {
      setClientes(
        clientes.filter((cliente) => cliente.id_cliente !== id_cliente)
      );
    }
  };

  // 🔵 EXPORTAR A EXCEL
  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "Clientes.xlsx");
  };

  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
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

      <div className="clientes-page">
        {/* Encabezado */}
        <div className="header-clientes">
          <h2>📜 Gestión de Clientes</h2>
          <div className="botones-clientes">
            <button className="btn-agregar" onClick={abrirModalAgregar}>
              <FaPlus /> Agregar Cliente
            </button>
            <button className="btn-exportar" onClick={exportarExcel}>
              📥 Exportar a Excel
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

        {/* Tabla con filtro */}
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
                <th>Frecuencia</th>
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
                    <td>{cliente.frecuencia_compra}</td>
                    <td className="acciones">
                      <button
                        className="btn-editar"
                        onClick={() => abrirModalEditar(cliente)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarCliente(cliente.id_cliente)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* MODAL MEJORADO */}
        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <h3>{editingClient ? "Editar Cliente" : "Agregar Cliente"}</h3>
              <div className="modal-form">
                <div className="input-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={clienteForm.nombre}
                    onChange={(e) =>
                      setClienteForm({ ...clienteForm, nombre: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={clienteForm.email}
                    onChange={(e) =>
                      setClienteForm({ ...clienteForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={clienteForm.telefono}
                    onChange={(e) =>
                      setClienteForm({
                        ...clienteForm,
                        telefono: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    value={clienteForm.direccion}
                    onChange={(e) =>
                      setClienteForm({
                        ...clienteForm,
                        direccion: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-buttons">
                <button className="btn-guardar" onClick={guardarCliente}>
                  Guardar
                </button>
                <button className="btn-cerrar" onClick={cerrarModal}>
                  <FaTimes /> Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;
