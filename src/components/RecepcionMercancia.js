import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaFilter,
  FaSearch,
  FaPlus,
  FaTruck,
  FaTimes,
  FaUsers, // ← Agregado
  FaEnvelope, // ← Agregado
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles.css";

const RecepcionMercancia = () => {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu((prev) => (prev === menu ? null : menu));
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaRecepcion, setNuevaRecepcion] = useState({
    numero: "",
    proveedor: "",
    almacen: "",
    fechaRecepcion: "",
    fechaDocumento: "",
    numDocumento: "",
    tipoProducto: "",
    cantidad: "",
    marca: "",
    estatus: "",
    total: "",
  });

  const handleChange = (e) => {
    setNuevaRecepcion({ ...nuevaRecepcion, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    console.log("Nueva Recepción:", nuevaRecepcion);
    setMostrarFormulario(false);
  };

  // Estado para los filtros y su visibilidad
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaCreacion: "",
    numeroDocumento: "",
    palabraClave: "",
    tipoProducto: "",
    estatus: "",
    proveedor: "",
    almacen: "",
  });

  const [productos, setProductos] = useState([
    {
      numero: "1001",
      proveedor: "Marvel Comics",
      almacen: "Bodega Norte",
      fechaRecepcion: "2025-03-01",
      fechaDocumento: "2025-02-28",
      numDocumento: "DOC-789",
      tipoProducto: "Comics",
      cantidad: 50,
      marca: "Marvel",
      estatus: "Recibido",
      total: "$1,200",
    },
    {
      numero: "1002",
      proveedor: "Hasbro",
      almacen: "Bodega Sur",
      fechaRecepcion: "2025-03-02",
      fechaDocumento: "2025-02-27",
      numDocumento: "DOC-790",
      tipoProducto: "Muñecos de Acción",
      cantidad: 30,
      marca: "Hasbro",
      estatus: "Pendiente",
      total: "$900",
    },
  ]);

  // Manejo de cambios en los filtros
  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  const [localEmpleado] = useState({
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  });

  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);

  return (
    <div className="almacenes-page">
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

      {/* Formulario emergente (modal) */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Agregar Recepción de Mercancía</h3>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="numero"
                placeholder="Número"
                onChange={handleChange}
              />
              <input
                type="text"
                name="proveedor"
                placeholder="Proveedor"
                onChange={handleChange}
              />
              <input
                type="text"
                name="almacen"
                placeholder="Almacén"
                onChange={handleChange}
              />
              <input
                type="date"
                name="fechaRecepcion"
                onChange={handleChange}
              />
              <input
                type="date"
                name="fechaDocumento"
                onChange={handleChange}
              />
              <input
                type="text"
                name="numDocumento"
                placeholder="Número de Documento"
                onChange={handleChange}
              />
              <select name="tipoProducto" onChange={handleChange}>
                <option value="">Seleccionar tipo</option>
                <option value="Comics">Comics</option>
                <option value="Figuras">Figuras</option>
              </select>
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                onChange={handleChange}
              />
              <input
                type="text"
                name="marca"
                placeholder="Marca"
                onChange={handleChange}
              />
              <select name="estatus" onChange={handleChange}>
                <option value="">Seleccionar estatus</option>
                <option value="Recibido">Recibido</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <input
                type="text"
                name="total"
                placeholder="Total"
                onChange={handleChange}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-guardar" onClick={handleGuardar}>
                <FaPlus /> Guardar
              </button>
              <button
                className="btn-cerrar"
                onClick={() => setMostrarFormulario(false)}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="main-content">
        <div className="almacen-header">
          <div className="header-title">
            <FaTruck className="header-icon" />
            <h2>Recepciones de Mercancía</h2>
          </div>
          <div className="header-actions">
            <button
              className="btn-agregar"
              onClick={() => setMostrarFormulario(true)}
            >
              <FaPlus /> Agregar
            </button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="filtro-container">
          <div
            className="filtro-header"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <div className="filtro-title">
              <FaFilter className="filtro-icon" />
              <h3>Filtros</h3>
              <span className="filtro-arrow">
                {mostrarFiltros ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>

          {mostrarFiltros && (
            <>
              <div className="filtro-content">
                <input
                  type="date"
                  name="fechaCreacion"
                  placeholder="Fecha de Creación"
                />
                <input
                  type="text"
                  name="numeroDocumento"
                  placeholder="Número de Documento"
                />
                <input
                  type="text"
                  name="palabraClave"
                  placeholder="Palabra Clave (Comics, Muñecos, etc.)"
                />

                {/* Select para Tipo de Producto */}
                <select name="tipoProducto">
                  <option value="">Seleccionar tipo</option>
                  <option value="Comics">Comics</option>
                  <option value="Figuras">Figuras</option>
                  <option value="Posters">Posters</option>
                </select>

                {/* Select para Estatus */}
                <select name="estatus">
                  <option value="">Seleccionar estatus</option>
                  <option value="Recibido">Recibido</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En camino">En camino</option>
                </select>

                <input type="text" name="proveedor" placeholder="Proveedor" />
                <input type="text" name="almacen" placeholder="Almacén" />
              </div>

              {/* Botón Buscar alineado al centro */}
              <div className="filtro-actions">
                <button className="btn-buscar">
                  <FaSearch /> Buscar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Tabla de Recepción */}
        <div className="almacen-table">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Proveedor</th>
                <th>Almacén</th>
                <th>Fecha de Recepción</th>
                <th>Fecha de Documento</th>
                <th>Núm. Documento</th>
                <th>Tipo Producto</th>
                <th>Cantidad</th>
                <th>Marca</th>
                <th>Estatus</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.numero}</td>
                  <td>{producto.proveedor}</td>
                  <td>{producto.almacen}</td>
                  <td>{producto.fechaRecepcion}</td>
                  <td>{producto.fechaDocumento}</td>
                  <td>{producto.numDocumento}</td>
                  <td>{producto.tipoProducto}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.marca}</td>
                  <td>{producto.estatus}</td>
                  <td>{producto.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RecepcionMercancia;
