import React, { useState, useEffect } from "react";
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
  FaCrown,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

const Membresias = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMembresia, setEditingMembresia] = useState(null);

  const [membresiaForm, setMembresiaForm] = useState({
    nombre: "",
    email: "",
    nivel: "regular",
    inicio: "",
    vencimiento: "",
  });

  const [membresias, setMembresias] = useState([
    {
      id: 1,
      nombre: "Carlos López",
      email: "carlos@example.com",
      nivel: "Gold",
      inicio: "2024-01-15",
      vencimiento: "2025-01-15",
      beneficios: "10% de descuento en compras y acceso a eventos exclusivos",
    },
    {
      id: 2,
      nombre: "María González",
      email: "maria@example.com",
      nivel: "Platinum",
      inicio: "2023-12-10",
      vencimiento: "2024-12-10",
      beneficios: "Envío gratis y descuentos exclusivos",
    },
  ]);

  // 🔄 Cargar Membresías desde el Backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Error al obtener clientes:", error));

    // 🔄 Cargar Membresías desde el Backend
    axios
      .get("http://localhost:8000/api/membresias")
      .then((response) => setMembresias(response.data))
      .catch((error) => console.error("Error al obtener membresías:", error));
  }, []);

  // 🟢 Abrir Modal para Agregar Membresía
  const abrirModalAgregar = () => {
    setEditingMembresia(null);
    setMembresiaForm({
      id_cliente: "",
      nivel: "regular",
      fecha_inicio: "",
      fecha_fin: "",
      beneficios: "",
    });
    setModalVisible(true);
  };

  // 🟢 Abrir Modal para Editar Membresía
  const abrirModalEditar = (membresia) => {
    setEditingMembresia(membresia);
    setMembresiaForm({
      nombre_cliente: membresia.nombre_cliente,
      email: membresia.email,
      nivel: membresia.nivel,
      fecha_inicio: membresia.fecha_inicio,
      fecha_fin: membresia.fecha_fin,
      beneficios: membresia.beneficios,
    });
    setModalVisible(true);
  };

  // 🔴 Cerrar Modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // ✅ Guardar Membresía (Agregar o Editar)
  const guardarMembresia = async () => {
    if (
      !membresiaForm.nombre_cliente ||
      !membresiaForm.fecha_inicio ||
      !membresiaForm.fecha_fin
    ) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      if (editingMembresia) {
        // Editar membresía existente
        await axios.put(
          `http://localhost:8000/api/membresias/${editingMembresia.id_membresia}`,
          membresiaForm
        );
      } else {
        // Agregar nueva membresía
        await axios.post("http://localhost:8000/api/membresias", membresiaForm);
      }

      // Recargar membresías
      const response = await axios.get("http://localhost:8000/api/membresias");
      setMembresias(response.data);
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar membresía:", error);
    }
  };

  // ❌ Eliminar Membresía
  const eliminarMembresia = async (id_membresia) => {
    if (window.confirm("¿Seguro que quieres eliminar esta membresía?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/membresias/${id_membresia}`
        );
        setMembresias(
          membresias.filter((m) => m.id_membresia !== id_membresia)
        );
      } catch (error) {
        console.error("Error al eliminar membresía:", error);
      }
    }
  };

  const verMembresia = (membresia) => {
    alert(`
      Cliente: ${membresia.nombre}
      Email: ${membresia.email}
      Nivel: ${membresia.nivel}
      Inicio: ${membresia.fecha_inicio}
      Vencimiento: ${membresia.fecha_fin}
      Beneficios: ${membresia.beneficios}
    `);
  };

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
    <div className="membresias-page">
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

      <div className="membresias-container">
        {/* Encabezado */}
        <div className="titulo-y-boton">
          <h2>📜 Gestión de Membresías</h2>
          <button className="btn-agregar" onClick={abrirModalAgregar}>
            <FaPlus /> Agregar Membresía
          </button>
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
          <table className="membresias-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Nivel</th>
                <th>Inicio</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            {/* Filtrar las membresías por nombre, email o nivel de membresía */}
            <tbody>
              {membresias
                .filter((m) =>
                  `${m.nombre} ${m.email} ${m.nivel}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((membresia, index) => (
                  <tr key={membresia.id_membresia}>
                    <td>{index + 1}</td>
                    <td>{membresia.nombre}</td>
                    <td>{membresia.email}</td>
                    <td>
                      <FaCrown className="icono-membresia" /> {membresia.nivel}
                    </td>

                    {/* 🔹 Formateamos la fecha si está en formato incorrecto */}
                    <td>
                      {membresia.fecha_inicio
                        ? new Date(membresia.fecha_inicio).toLocaleDateString()
                        : "Sin fecha"}
                    </td>
                    <td>
                      {membresia.fecha_fin
                        ? new Date(membresia.fecha_fin).toLocaleDateString()
                        : "Sin fecha"}
                    </td>

                    <td>{membresia.beneficios}</td>
                    <td className="acciones">
                      <button
                        className="btn-ver"
                        onClick={() => verMembresia(membresia)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-editar"
                        onClick={() => abrirModalEditar(membresia)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() =>
                          eliminarMembresia(membresia.id_membresia)
                        }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <h3>
                {editingMembresia ? "Editar Membresía" : "Agregar Membresía"}
              </h3>

              <div className="modal-form">
                {/* Selección de Cliente */}
                <div className="input-group">
                  <label>Cliente</label>
                  <select
                    value={membresiaForm.id_cliente}
                    onChange={(e) =>
                      setMembresiaForm({
                        ...membresiaForm,
                        id_cliente: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccione un Cliente</option>
                    {clientes.map((cliente) => (
                      <option
                        key={cliente.id_cliente}
                        value={cliente.id_cliente}
                      >
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nivel de Membresía */}
                <div className="input-group">
                  <label>Nivel de Membresía</label>
                  <select
                    value={membresiaForm.nivel}
                    onChange={(e) =>
                      setMembresiaForm({
                        ...membresiaForm,
                        nivel: e.target.value,
                      })
                    }
                  >
                    <option value="regular">Regular</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                {/* Fecha de Inicio */}
                <div className="input-group">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    value={membresiaForm.fecha_inicio}
                    onChange={(e) =>
                      setMembresiaForm({
                        ...membresiaForm,
                        fecha_inicio: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Fecha de Vencimiento */}
                <div className="input-group">
                  <label>Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={membresiaForm.fecha_fin}
                    onChange={(e) =>
                      setMembresiaForm({
                        ...membresiaForm,
                        fecha_fin: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Beneficios */}
                <div className="input-group">
                  <label>Beneficios</label>
                  <textarea
                    rows="3"
                    value={membresiaForm.beneficios}
                    onChange={(e) =>
                      setMembresiaForm({
                        ...membresiaForm,
                        beneficios: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="modal-buttons">
                <button className="btn-guardar" onClick={guardarMembresia}>
                  Guardar
                </button>
                <button className="btn-cerrar" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membresias;
