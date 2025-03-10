import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaSignOutAlt,
  FaFileInvoiceDollar,
  FaPlus,
  FaCog,
  FaFilter,
  FaEllipsisV,
  FaEdit,
  FaSearch,
  FaHashtag,
  FaDollarSign,
  FaTrash,
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaEnvelope,
} from "react-icons/fa";
import "../styles.css";

const Almacenes = () => {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");

  const [productos, setProductos] = useState([
    {
      id: 111540,
      nombre: "ACTUALIZACION EQUIPOS POSVENTA",
      sucursal: "Mantenimiento y Garantías",
      cantidad: 10,
      precio: 500,
    },
    {
      id: 110616,
      nombre: "ADMINISTRACIÓN",
      sucursal: "CEDIS",
      cantidad: 5,
      precio: 800,
    },
  ]);

  const handleEditar = (id) => {
    navigate(`/editar-producto/${id}`);
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const toggleOpciones = () => {
    setMostrarOpciones(!mostrarOpciones);
  };

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioVisible(!menuUsuarioVisible);
  };

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  const localEmpleado = {
    nombre: "Juan Pérez",
    correo: "juanperez@example.com",
  };

  const filtrarResultados = () => {
    return Almacenes.filter(
      (almacen) =>
        (filtroNumero ? almacen.id.toString().includes(filtroNumero) : true) &&
        (filtroNombre
          ? almacen.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
          : true) &&
        (filtroPrecio ? almacen.precio.toString().includes(filtroPrecio) : true)
    );
  };

  return (
    <div className="almacenes-page">
      {/* Sidebar - Menú Lateral */}
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

      {/* Contenido principal de Almacenes */}
      <main className="main-content">
        <div className="almacen-header">
          <div className="almacen-title">
            <FaBoxOpen className="header-icon" />
            <h2>Almacén</h2>
          </div>

          {/* Botones alineados a la derecha en la misma fila */}
          <div className="almacen-actions">
            <button className="btn btn-green" onClick={toggleFormulario}>
              <FaPlus /> Agregar
            </button>
            {/* Botón "Más opciones" con submenú */}
            <div className="menu-opciones-container">
              <button className="btn btn-gray" onClick={toggleOpciones}>
                <FaEllipsisV /> Más opciones
              </button>

              {mostrarOpciones && (
                <div className="submenu-opciones">
                  <button
                    className="btn-opcion"
                    onClick={() => handleEditar(111540)}
                  >
                    {" "}
                    {/* Usa un ID dinámico */}
                    <FaEdit /> Editar
                  </button>
                </div>
              )}
            </div>
            <button className="btn btn-filter" onClick={toggleFiltros}>
              <FaFilter /> Filtros
            </button>
          </div>
        </div>

        {/* Filtros desplegables en la misma página */}
        {mostrarFiltros && (
          <div className="filtro-container">
            <table className="filtro-table">
              <thead>
                <tr>
                  <th>
                    <FaHashtag /> Número
                  </th>
                  <th>
                    <FaSearch /> Nombre
                  </th>
                  <th>
                    <FaDollarSign /> Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Folio"
                      value={filtroNumero}
                      onChange={(e) => setFiltroNumero(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={filtroNombre}
                      onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Precio"
                      value={filtroPrecio}
                      onChange={(e) => setFiltroPrecio(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tabla de almacenes con los resultados filtrados */}
        <div className="almacen-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Sucursal</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.sucursal}</td>
                  <td>{producto.cantidad}</td>
                  <td>${producto.precio}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(`/editar-producto/${producto.id}`)
                      }
                    >
                      <FaEdit /> Editar
                    </button>
                    <button className="btn-delete">
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>📦 Registrar Producto</h3>
              <form>
                <div className="form-group">
                  <label>
                    <FaBoxOpen /> Nombre del Producto:
                  </label>
                  <input type="text" placeholder="Ingrese el nombre" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaHome /> Sucursal:
                    </label>
                    <input type="text" placeholder="Ingrese la sucursal" />
                  </div>

                  <div className="form-group">
                    <label>
                      <FaBoxOpen /> Cantidad:
                    </label>
                    <input type="number" placeholder="Ingrese la cantidad" />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <FaFileInvoiceDollar /> Precio:
                  </label>
                  <input type="number" placeholder="Ingrese el precio" />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-save">
                    ✅ Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={toggleFormulario}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Almacenes;
