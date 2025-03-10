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
  // Estados
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");

  const [productoForm, setProductoForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "comic",
    stock_actual: 0,
    precio: 0,
    editorial_o_marca: "",
    fecha_lanzamiento: "",
  });

  const [productos, setProductos] = useState([
    {
      id_producto: 1,
      nombre: "Spider-Man #1",
      descripcion: "Edición limitada de Spider-Man",
      categoria: "comic",
      stock_actual: 15,
      precio: 299.99,
      editorial_o_marca: "Marvel",
      fecha_lanzamiento: "2024-02-15",
    },
    {
      id_producto: 2,
      nombre: "Figura de Batman",
      descripcion: "Figura coleccionable edición especial",
      categoria: "figura de colección",
      stock_actual: 5,
      precio: 799.99,
      editorial_o_marca: "DC Comics",
      fecha_lanzamiento: "2023-11-01",
    },
  ]);

  // 🛒 Agregar Producto
  const agregarProducto = () => {
    if (!productoForm.nombre || productoForm.precio <= 0) {
      alert("Completa los campos obligatorios.");
      return;
    }

    setProductos([
      ...productos,
      { ...productoForm, id_producto: productos.length + 1 },
    ]);

    setProductoForm({
      nombre: "",
      descripcion: "",
      categoria: "comic",
      stock_actual: 0,
      precio: 0,
      editorial_o_marca: "",
      fecha_lanzamiento: "",
    });

    setMostrarFormulario(false);
  };

  // ✏️ Editar Producto
  const editarProducto = (id_producto) => {
    const producto = productos.find((p) => p.id_producto === id_producto);
    if (producto) {
      setProductoForm(producto);
      setMostrarFormulario(true);
    }
  };

  // ❌ Eliminar Producto
  const eliminarProducto = (id_producto) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id_producto !== id_producto));
    }
  };

  // 🔍 Filtrar Productos
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Encabezado */}
      {/* Encabezado */}
      <div className="almacen-header">
        <h2>
          <FaBoxOpen /> Gestión de Productos en Almacén
        </h2>
        <button
          className="btn-agregar"
          onClick={() => setMostrarFormulario(true)}
        >
          <FaPlus /> Agregar Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="buscador">
        <FaSearch className="icono-busqueda" />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="tabla-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Marca/Editorial</th>
              <th>Fecha de Lanzamiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p, index) => (
              <tr key={p.id_producto}>
                <td>{index + 1}</td>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>{p.categoria}</td>
                <td>{p.stock_actual}</td>
                <td>${p.precio.toFixed(2)}</td>
                <td>{p.editorial_o_marca || "N/A"}</td>
                <td>{p.fecha_lanzamiento || "N/A"}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => editarProducto(p.id_producto)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarProducto(p.id_producto)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario de Registro y Edición */}
      {mostrarFormulario && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {productoForm.id_producto ? "Editar Producto" : "Nuevo Producto"}
            </h3>
            <label>Nombre:</label>
            <input
              type="text"
              value={productoForm.nombre}
              onChange={(e) =>
                setProductoForm({ ...productoForm, nombre: e.target.value })
              }
            />
            <label>Descripción:</label>
            <input
              type="text"
              value={productoForm.descripcion}
              onChange={(e) =>
                setProductoForm({
                  ...productoForm,
                  descripcion: e.target.value,
                })
              }
            />
            <label>Categoría:</label>
            <select
              value={productoForm.categoria}
              onChange={(e) =>
                setProductoForm({ ...productoForm, categoria: e.target.value })
              }
            >
              <option value="comic">Comic</option>
              <option value="figura de colección">Figura de colección</option>
            </select>
            <label>Stock Actual:</label>
            <input
              type="number"
              value={productoForm.stock_actual}
              onChange={(e) =>
                setProductoForm({
                  ...productoForm,
                  stock_actual: Number(e.target.value),
                })
              }
            />
            <label>Precio:</label>
            <input
              type="number"
              value={productoForm.precio}
              onChange={(e) =>
                setProductoForm({
                  ...productoForm,
                  precio: Number(e.target.value),
                })
              }
            />
            <button onClick={agregarProducto}>Guardar</button>
            <button onClick={() => setMostrarFormulario(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Almacenes;
