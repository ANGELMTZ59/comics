import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaCog,
  FaFilter,
  FaEllipsisV,
  FaEdit,
  FaSearch,
  FaHashtag,
  FaDollarSign,
  FaTrash,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaHome
} from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Se importa el Sidebar
import "../promociones.css";

const Almacenes = () => {
  const navigate = useNavigate();
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

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  return (
    <div className="almacenes-page">
      <Sidebar /> {/* ✅ Se muestra el sidebar importado */}

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
