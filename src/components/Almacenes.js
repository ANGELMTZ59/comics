import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen } from "react-icons/fa";
import Sidebar from "./sidebar";
import "../promociones.css";

const API_URL = "https://fastapi-my17.onrender.com/api"; // updated URL

const Almacenes = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [productoForm, setProductoForm] = useState({
    id_producto: null,
    nombre: "",
    descripcion: "",
    categoria: "comic",
    stock_actual: 0,
    stock_minimo: 0,
    precio: 0,
    editorial_o_marca: "",
    fecha_lanzamiento: "",
    imagen_url: "",
    id_proveedor: "",
  });

  // 💾 Mostrar el formulario de nuevo producto
  const agregarProducto = () => {
    setProductoForm({
      id_producto: null,
      nombre: "",
      descripcion: "",
      categoria: "comic",
      stock_actual: 0,
      stock_minimo: 0,
      precio: 0,
      editorial_o_marca: "",
      fecha_lanzamiento: "",
      imagen_url: "",
      id_proveedor: "",
    });
    setIsEditing(false); // Modo agregar
    setMostrarFormulario(true);
  };

  // 🚀 Cargar productos y proveedores
  useEffect(() => {
    fetchProductos(); // Para cargar productos
    fetchProveedores(); // Asegúrate de que los proveedores se carguen
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/productos`);
      if (res.data.success) {
        setProductos(res.data.productos);

        // Alert for low stock
        const lowStockProducts = res.data.productos.filter(
          (p) => p.stock_actual <= p.stock_minimo
        );
        if (lowStockProducts.length > 0) {
          alert(
            `⚠️ Los siguientes productos tienen stock bajo:\n${lowStockProducts
              .map((p) => `${p.nombre} (Stock actual: ${p.stock_actual})`)
              .join("\n")}`
          );
        }

        // Alert for excess stock
        const excessStockProducts = res.data.productos.filter(
          (p) => p.stock_actual > 300
        );
        if (excessStockProducts.length > 0) {
          alert(
            `⚠️ Los siguientes productos tienen exceso de stock (más de 300 unidades):\n${excessStockProducts
              .map((p) => `${p.nombre} (Stock actual: ${p.stock_actual})`)
              .join("\n")}\nPor favor, considera estabilizar el inventario.`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await axios.get(`${API_URL}/proveedores`);
      if (res.data.success) setProveedores(res.data.proveedores);
    } catch (err) {
      console.error("❌ Error al obtener proveedores:", err);
    }
  };

  // 💾 Guardar producto
  const guardarProducto = async () => {
    if (!productoForm.nombre || isNaN(productoForm.precio)) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      console.log("📤 Enviando datos del producto:", productoForm); // Debugging log

      if (isEditing) {
        // Actualizar producto
        await axios.put(
          `${API_URL}/productos/${productoForm.id_producto}`,
          productoForm
        );
      } else {
        // Agregar nuevo producto
        await axios.post(`${API_URL}/productos`, productoForm);
      }
      fetchProductos();
      setMostrarFormulario(false);
      setIsEditing(false); // Resetear el estado
    } catch (err) {
      console.error("❌ Error al guardar producto:", err);

      // Mostrar mensaje de error más detallado
      alert(
        `Error al guardar el producto: ${
          err.response?.data?.message || "Error desconocido."
        }`
      );
    }
  };

  // 📝 Editar
  const editarProducto = (producto) => {
    setProductoForm(producto);
    setIsEditing(true); // Activar edición
    setMostrarFormulario(true);
  };

  // 🗑️ Eliminar
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await axios.delete(`${API_URL}/productos/${id}`);
      fetchProductos();
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    `${p.nombre} ${p.descripcion}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="almacenes-page">
      <Sidebar />

      <div className="almacen-header">
        <h2>
          <FaBoxOpen /> Gestión de Productos en Almacén
        </h2>
        <button className="btn-agregar" onClick={agregarProducto}>
          <FaPlus /> Agregar Producto
        </button>
      </div>

      <div className="buscador">
        <FaSearch className="icono-busqueda" />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tabla-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Precio</th>
              <th>Marca/Editorial</th>
              <th>Fecha de Lanzamiento</th>
              <th>Proveedor</th>
              <th>Imagen</th>
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
                <td>{p.stock_minimo}</td>
                <td>${parseFloat(p.precio || 0).toFixed(2)}</td>
                <td>{p.editorial_o_marca}</td>
                <td>
                  {p.fecha_lanzamiento
                    ? new Date(p.fecha_lanzamiento).toLocaleDateString("es-ES")
                    : "N/A"}
                </td>{" "}
                {/* Formateo de la fecha */}
                <td>{p.proveedor || "N/A"}</td>
                <td>
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt="Producto" width={40} />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => editarProducto(p)}
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
                  stock_actual: e.target.value,
                })
              }
            />
            <label>Stock Mínimo:</label>
            <input
              type="number"
              value={productoForm.stock_minimo}
              onChange={(e) =>
                setProductoForm({
                  ...productoForm,
                  stock_minimo: e.target.value,
                })
              }
            />
            <label>Precio:</label>
            <input
              type="number"
              value={productoForm.precio}
              onChange={(e) =>
                setProductoForm({ ...productoForm, precio: e.target.value })
              }
            />
            <label>Marca/Editorial:</label>
            <input
              type="text"
              value={productoForm.editorial_o_marca}
              onChange={(e) =>
                setProductoForm({
                  ...productoForm,
                  editorial_o_marca: e.target.value,
                })
              }
            />
            <label>Fecha de Lanzamiento:</label>
            <input
              type="date"
              value={productoForm.fecha_lanzamiento}
              onChange={(e) =>
                setProductoForm({
                  ...productoForm,
                  fecha_lanzamiento: e.target.value,
                })
              }
            />
            <label>Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProductoForm({
                      ...productoForm,
                      imagen_url: reader.result, // Guardamos la imagen en base64
                    });
                  };
                  reader.readAsDataURL(file); // Convertir la imagen a base64
                }
              }}
            />
            <label>Proveedor:</label>
            <select
              value={productoForm.id_proveedor}
              onChange={(e) =>
                setProductoForm({
                  ...productoForm,
                  id_proveedor: e.target.value,
                })
              }
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id_proveedor} value={prov.id_proveedor}>
                  {prov.nombre}
                </option>
              ))}
            </select>

            {/* Botones de Guardar y Cancelar */}
            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarProducto}>
                Guardar
              </button>
              <button
                className="btn-cerrar"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Almacenes;
