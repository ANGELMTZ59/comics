import React, { useEffect, useState } from "react";
import { FaPlus, FaTruck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Sidebar from "./sidebar";
import "../mercancia.css";

const API_URL = "http://localhost:5000/api";

const RecepcionMercancia = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Add state for filtered products
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

  // 🟢 Obtener datos al cargar
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/proveedores`).then((res) => {
      if (res.data.success) setProveedores(res.data.proveedores);
    });

    // 🔧 Agregar esta línea para cargar los productos
    obtenerRecepciones();
  }, []);

  useEffect(() => {
    // Filter products whenever the search query changes
    const filtered = productos.filter((producto) => {
      const searchQuery = busqueda.toLowerCase();
      return (
        producto.proveedor.toLowerCase().includes(searchQuery) ||
        producto.tipo_producto.toLowerCase().includes(searchQuery) ||
        producto.numero_documento.toLowerCase().includes(searchQuery) ||
        producto.marca.toLowerCase().includes(searchQuery)
      );
    });
    setProductosFiltrados(filtered);
  }, [busqueda, productos]); // Re-run filter when search query or products change

  const obtenerRecepciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/recepciones`);
      console.log("📋 Datos recibidos del servidor:", res.data); // Log the entire response
      if (res.data.success) {
        setProductos(res.data.recepciones); // Update state with fetched data
        console.log(
          "✅ Productos actualizados en el estado:",
          res.data.recepciones
        ); // Log updated state
      } else {
        console.warn("⚠ No se encontraron recepciones:", res.data.message);
      }
    } catch (error) {
      console.error("❌ Error al obtener recepciones:", error);
    }
  };

  const handleChange = (e) => {
    setNuevaRecepcion({ ...nuevaRecepcion, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      // Map frontend field names to backend field names
      const payload = {
        id_recepcion: nuevaRecepcion.id_recepcion,
        numero_documento: nuevaRecepcion.numDocumento,
        id_proveedor: nuevaRecepcion.id_proveedor,
        almacen: nuevaRecepcion.almacen,
        fecha_recepcion: nuevaRecepcion.fechaRecepcion,
        fecha_documento: nuevaRecepcion.fechaDocumento,
        tipo_producto: nuevaRecepcion.tipoProducto,
        cantidad: nuevaRecepcion.cantidad,
        marca: nuevaRecepcion.marca,
        estatus: nuevaRecepcion.estatus,
        total: nuevaRecepcion.total,
      };

      // Log the payload being sent to the backend
      console.log("📤 Payload enviado al backend:", payload);

      // Validar campos obligatorios
      if (!payload.id_proveedor) {
        alert("Por favor, seleccione un proveedor.");
        return;
      }
      if (!payload.almacen) {
        alert("Por favor, ingrese el almacén.");
        return;
      }
      if (!payload.fecha_recepcion) {
        alert("Por favor, ingrese la fecha de recepción.");
        return;
      }
      if (!payload.numero_documento) {
        alert("Por favor, ingrese el número de documento.");
        return;
      }
      if (!payload.tipo_producto) {
        alert("Por favor, seleccione el tipo de producto.");
        return;
      }
      if (!payload.cantidad || payload.cantidad <= 0) {
        alert("Por favor, ingrese una cantidad válida.");
        return;
      }
      if (!payload.marca) {
        alert("Por favor, ingrese la marca.");
        return;
      }
      if (!payload.estatus) {
        alert("Por favor, seleccione el estatus.");
        return;
      }
      if (!payload.total || payload.total <= 0) {
        alert("Por favor, ingrese un total válido.");
        return;
      }

      // Crear o actualizar recepción
      if (payload.id_recepcion) {
        // Actualizar registro existente
        const res = await axios.put(
          `${API_URL}/recepciones/${payload.id_recepcion}`,
          payload
        );
        if (res.data.success) {
          console.log("Recepción actualizada correctamente.");
          obtenerRecepciones(); // Refrescar la lista
          setMostrarFormulario(false);
        }
      } else {
        // Crear nuevo registro
        const res = await axios.post(`${API_URL}/recepciones`, payload);
        if (res.data.success) {
          console.log("Nueva recepción creada correctamente.");
          obtenerRecepciones(); // Refrescar la lista
          setNuevaRecepcion({
            // Reset form state
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
          setMostrarFormulario(false);
        }
      }
    } catch (error) {
      console.error("❌ Error al guardar recepción:", error);
      alert("Ocurrió un error al guardar la recepción.");
    }
  };

  const handleEditar = (producto) => {
    setNuevaRecepcion({
      id_recepcion: producto.id_recepcion, // Ensure this ID is present
      numero: producto.numero, // Map numero correctly
      id_proveedor:
        proveedores.find((prov) => prov.nombre === producto.proveedor)
          ?.id_proveedor || "", // Map id_proveedor based on the provider name
      almacen: producto.almacen,
      fechaRecepcion: producto.fecha_recepcion?.substring(0, 10), // Format date for input
      fechaDocumento: producto.fecha_documento?.substring(0, 10), // Format date for input
      numDocumento: producto.numero_documento, // Map numero_documento
      tipoProducto: producto.tipo_producto, // Map tipo_producto
      cantidad: producto.cantidad,
      marca: producto.marca,
      estatus: producto.estatus,
      total: producto.total,
    });
    setMostrarFormulario(true); // Show the edit form
  };

  const handleEliminar = async (id) => {
    if (!id) {
      console.error("❌ El ID de la recepción es inválido."); // Log the invalid ID
      alert(
        "El ID de la recepción es inválido. Por favor, intente nuevamente."
      );
      return;
    }
    console.log("ID de la recepción que se va a eliminar:", id); // Log the valid ID

    try {
      const res = await axios.delete(`${API_URL}/recepciones/${id}`);
      if (res.data.success) {
        console.log("Eliminación exitosa, refrescando lista de recepciones");
        obtenerRecepciones(); // Refresh the list after deletion
      }
    } catch (error) {
      console.error("❌ Error al eliminar recepción:", error);
      alert("Ocurrió un error al eliminar la recepción");
    }
  };

  // Función de búsqueda que actualiza el estado de búsqueda
  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <div className="recepcion-page">
      <Sidebar />

      {/* Modal */}
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
              <select name="id_proveedor" onChange={handleChange}>
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

        {/* Barra de búsqueda */}
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
                  productosFiltrados.map((producto) => {
                    if (!producto.id_recepcion) {
                      console.warn("⚠ Producto sin id_recepcion:", producto); // Warn if id_recepcion is missing
                      return null; // Skip rendering this row
                    }
                    return (
                      <tr key={producto.id_recepcion}>
                        {/* Render product details */}
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
                            onClick={() => handleEditar(producto)} // Pass the full product object
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-accion eliminar"
                            onClick={() =>
                              handleEliminar(producto.id_recepcion)
                            } // Pass id_recepcion
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
