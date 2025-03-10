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
  FaEdit,
  FaTrash,
  FaTag,
  FaToggleOn,
  FaToggleOff,
  FaUserCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaTags,
  FaEye,
} from "react-icons/fa";
import "../styles.css";

const Promociones = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [promocionForm, setPromocionForm] = useState({
    id_producto: "",
    descripcion: "",
    descuento: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "activa",
  });
  const [editingPromocion, setEditingPromocion] = useState(null);

  useEffect(() => {
    // Datos simulados
    setProductos([
      { id_producto: 1, nombre: "Laptop Dell" },
      { id_producto: 2, nombre: "Mouse Gamer" },
    ]);
    setPromociones([
      {
        id_promocion: 1,
        producto: "Laptop Dell",
        descripcion: "Descuento especial de primavera",
        descuento: "15%",
        fecha_inicio: "2025-03-10",
        fecha_fin: "2025-03-20",
        estado: "activa",
      },
      {
        id_promocion: 2,
        producto: "Mouse Gamer",
        descripcion: "Oferta relámpago",
        descuento: "10%",
        fecha_inicio: "2025-03-08",
        fecha_fin: "2025-03-15",
        estado: "inactiva",
      },
    ]);
  }, []);

  const abrirModal = (promocion = null) => {
    setEditingPromocion(promocion);
    setPromocionForm(
      promocion || {
        id_producto: "",
        descripcion: "",
        descuento: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "activa",
      }
    );
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const guardarPromocion = () => {
    if (
      !promocionForm.id_producto ||
      !promocionForm.descripcion ||
      !promocionForm.descuento
    ) {
      alert("Completa todos los campos");
      return;
    }
    const productoSeleccionado = productos.find(
      (p) => p.id_producto.toString() === promocionForm.id_producto
    );
    const nuevaPromocion = {
      id_promocion: promociones.length + 1,
      producto: productoSeleccionado
        ? productoSeleccionado.nombre
        : "Desconocido",
      ...promocionForm,
    };
    setPromociones((prev) => [...prev, nuevaPromocion]);
    cerrarModal();
  };

  // Estado del menú lateral
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);

  // Datos del usuario local
  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

  // Función para alternar los submenús
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // Función para mostrar el menú de usuario
  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  return (
    <div className="promociones-page">
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

      <div className="promociones-container">
        <div className="encabezado">
          <h2>
            <FaTags /> Gestión de Promociones
          </h2>
          <button className="btn-agregar" onClick={() => abrirModal()}>
            <FaPlus /> Agregar Promoción
          </button>
        </div>

        <div className="buscador">
          <FaSearch className="icono-busqueda" />
          <input
            type="text"
            placeholder="Buscar por producto o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="promociones-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Descuento</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promociones &&
              promociones.length > 0 &&
              promociones
                .filter(
                  (p) =>
                    (p.producto &&
                      p.producto
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                    (p.descripcion &&
                      p.descripcion
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
                )

                .map((p, index) => (
                  <tr key={p.id_promocion}>
                    <td>{index + 1}</td>
                    <td>{p.producto}</td>
                    <td>{p.descripcion}</td>
                    <td>{p.descuento}</td>
                    <td>{p.fecha_inicio}</td>
                    <td>{p.fecha_fin}</td>
                    <td>{p.estado}</td>
                    <td>
                      <button className="btn-ver">
                        <FaEye />
                      </button>
                      <button
                        className="btn-editar"
                        onClick={() => abrirModal(p)}
                      >
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

        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <h3>
                {editingPromocion ? "Editar Promoción" : "Nueva Promoción"}
              </h3>
              <label>Producto:</label>
              <select
                value={promocionForm.id_producto}
                onChange={(e) =>
                  setPromocionForm({
                    ...promocionForm,
                    id_producto: e.target.value,
                  })
                }
              >
                <option value="">Seleccione un Producto</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              <label>Descripción:</label>
              <input
                type="text"
                value={promocionForm.descripcion}
                onChange={(e) =>
                  setPromocionForm({
                    ...promocionForm,
                    descripcion: e.target.value,
                  })
                }
              />
              <label>Descuento (%):</label>
              <input
                type="number"
                value={promocionForm.descuento}
                onChange={(e) =>
                  setPromocionForm({
                    ...promocionForm,
                    descuento: e.target.value,
                  })
                }
              />
              <button onClick={guardarPromocion}>Guardar</button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promociones;
