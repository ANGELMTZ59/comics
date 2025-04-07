import React, { useEffect, useState } from "react";
import { FaPlus, FaTruck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Sidebar from "./sidebar";
import "../mercancia.css";

const API_URL = "http://localhost:5000/api";

const RecepcionMercancia = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // Nuevo estado para diferenciar agregar de editar
  const [productos, setProductos] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [nuevaRecepcion, setNuevaRecepcion] = useState({
    id_recepcion: "",
    numDocumento: "",
    proveedor: "",
    almacen: "",
    fechaRecepcion: "",
    fechaDocumento: "",
    tipoProducto: "",
    cantidad: "",
    marca: "",
    estatus: "",
    total: "",
  });

  const handleAgregar = () => {
    setNuevaRecepcion({
      id_recepcion: "", // No hay id cuando estamos agregando
      numDocumento: "", // El número de documento lo generamos automáticamente
      proveedor: "",
      almacen: "",
      fechaRecepcion: "",
      fechaDocumento: "",
      tipoProducto: "",
      cantidad: "",
      marca: "",
      estatus: "",
      total: "",
    });
    setMostrarFormulario(true); // Mostrar el formulario en modo de agregar
  };

  // 🟢 Obtener proveedores y productos
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/proveedores`).then((res) => {
      if (res.data.success) setProveedores(res.data.proveedores);
    });

    obtenerRecepciones();
  }, []);

  const obtenerRecepciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/recepciones`);
      if (res.data.success) {
        setProductos(res.data.recepciones);
      }
    } catch (error) {
      console.error("❌ Error al obtener recepciones:", error);
    }
  };

  const handleChange = (e) => {
    setNuevaRecepcion({
      ...nuevaRecepcion,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = async () => {
    try {
      const totalConComa = nuevaRecepcion.total.replace(",", ".");
      setNuevaRecepcion({
        ...nuevaRecepcion,
        total: totalConComa, // Convertimos la coma en un punto para poder guardarlo correctamente
      });

      const payload = {
        ...nuevaRecepcion,
      };

      const res = await axios.post(`${API_URL}/recepciones`, payload);
      if (res.data.success) {
        console.log("Nueva recepción creada correctamente.");
        obtenerRecepciones(); // Refrescar la lista

        // Check stock levels
        const productoRes = await axios.get(
          `${API_URL}/productos/${nuevaRecepcion.id_producto}`
        );
        const producto = productoRes.data;

        if (producto.stock_actual <= producto.stock_minimo) {
          alert(
            `⚠️ El producto "${producto.nombre}" sigue con stock bajo.\nStock actual: ${producto.stock_actual}, Stock mínimo: ${producto.stock_minimo}`
          );
        }

        if (producto.stock_actual > 300) {
          alert(
            `⚠️ El producto "${producto.nombre}" tiene exceso de stock (más de 300 unidades).\nStock actual: ${producto.stock_actual}.\nPor favor, considera estabilizar el inventario.`
          );
        }

        setMostrarFormulario(false); // Cerrar el formulario
      }
    } catch (error) {
      console.error("❌ Error al guardar recepción:", error);
      alert("Ocurrió un error al guardar la recepción.");
    }
  };

  // Y al cancelar
  const handleCancelar = () => {
    setMostrarFormulario(false); // Cerrar el formulario
  };

  const handleEditar = (producto) => {
    setIsEditMode(true); // Activamos el modo de edición
    setNuevaRecepcion({
      id_recepcion: producto.id_recepcion,
      numDocumento: producto.numero_documento, // Mostrar número de documento en editar
      proveedor: producto.id_proveedor,
      almacen: producto.almacen,
      fechaRecepcion: producto.fecha_recepcion?.substring(0, 10),
      fechaDocumento: producto.fecha_documento?.substring(0, 10),
      tipoProducto: producto.tipo_producto,
      cantidad: producto.cantidad,
      marca: producto.marca,
      estatus: producto.estatus,
      total: producto.total,
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/recepciones/${id}`);
      if (res.data.success) {
        obtenerRecepciones();
      }
    } catch (error) {
      console.error("❌ Error al eliminar recepción:", error);
      alert("Ocurrió un error al eliminar la recepción");
    }
  };

  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  const productosFiltrados = productos.filter((producto) => {
    const searchQuery = busqueda.toLowerCase();
    return (
      producto.proveedor.toLowerCase().includes(searchQuery) ||
      producto.tipo_producto.toLowerCase().includes(searchQuery) ||
      producto.numero_documento.toLowerCase().includes(searchQuery) ||
      producto.marca.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className="recepcion-page">
      <Sidebar />

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {nuevaRecepcion.id_recepcion
                  ? "Editar Recepción de Mercancía"
                  : "Agregar Recepción de Mercancía"}
              </h3>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="numero"
                placeholder="Número"
                value={nuevaRecepcion.numDocumento}
                onChange={handleChange}
                disabled // El número se genera automáticamente
              />
              <select
                name="proveedor"
                onChange={handleChange}
                value={nuevaRecepcion.proveedor}
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((prov) => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.nombre}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="almacen"
                placeholder="Almacén"
                value={nuevaRecepcion.almacen}
                onChange={handleChange}
              />
              <input
                type="date"
                name="fechaRecepcion"
                value={nuevaRecepcion.fechaRecepcion}
                onChange={handleChange}
              />
              <input
                type="date"
                name="fechaDocumento"
                value={nuevaRecepcion.fechaDocumento}
                onChange={handleChange}
              />
              <select
                name="tipoProducto"
                onChange={handleChange}
                value={nuevaRecepcion.tipoProducto}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Comics">Comics</option>
                <option value="Figuras">Figuras</option>
              </select>
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                value={nuevaRecepcion.cantidad}
                onChange={handleChange}
              />
              <input
                type="text"
                name="marca"
                placeholder="Marca"
                value={nuevaRecepcion.marca}
                onChange={handleChange}
              />
              <select
                name="estatus"
                onChange={handleChange}
                value={nuevaRecepcion.estatus}
              >
                <option value="">Seleccionar estatus</option>
                <option value="Recibido">Recibido</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <input
                type="text"
                name="total"
                placeholder="Total"
                value={nuevaRecepcion.total}
                onChange={handleChange}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-guardar" onClick={handleGuardar}>
                <FaPlus /> Guardar
              </button>
              <button
                className="btn-cerrar"
                onClick={handleCancelar} // Aquí llamamos a handleCancelar
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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

        <div className="filtro-container">
          <input
            type="text"
            placeholder="Buscar por proveedor, tipo de producto..."
            value={busqueda}
            onChange={handleBuscar}
            className="busqueda-input"
          />
        </div>

        <div className="almacen-table-wrapper">
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
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="11">No hay registros disponibles.</td>
                  </tr>
                ) : (
                  productosFiltrados.map((producto) => (
                    <tr key={producto.id_recepcion}>
                      <td>{producto.numero}</td>
                      <td>{producto.proveedor}</td>
                      <td>{producto.almacen}</td>
                      <td>{producto.fecha_recepcion?.substring(0, 10)}</td>
                      <td>{producto.fecha_documento?.substring(0, 10)}</td>
                      <td>{producto.numero_documento}</td>
                      <td>{producto.tipo_producto}</td>
                      <td>{producto.cantidad}</td>
                      <td>{producto.marca}</td>
                      <td>{producto.estatus}</td>
                      <td>{Number(producto.total).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-accion editar"
                          onClick={() => handleEditar(producto)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-accion eliminar"
                          onClick={() => handleEliminar(producto.id_recepcion)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecepcionMercancia;
