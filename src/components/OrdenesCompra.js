import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaTimes,
} from "react-icons/fa";
import Sidebar from "./sidebar";
import "../ordenesCompra.css";

const API_URL = "http://localhost:5000/api";

const OrdenesCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [nuevaOrden, setNuevaOrden] = useState({
    id_producto: "",
    cantidad: "",
    id_proveedor: "",
    fechaOrden: "", // Este lo formateamos antes de enviarlo
    estado: "pendiente",
  });

  // Obtener productos desde la BD
  const [productos, setProductos] = useState([]);
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${API_URL}/productos`);
        console.log("Productos:", response.data.productos); // Verifica que los productos lleguen correctamente
        if (response.data.success) {
          setProductos(response.data.productos);
        }
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(`${API_URL}/proveedores`);
        console.log("Proveedores:", response.data.proveedores);
        if (response.data.success) {
          setProveedores(response.data.proveedores);
        }
      } catch (error) {
        console.error("❌ Error al obtener proveedores:", error);
      }
    };

    fetchProveedores();
  }, []);

  // 🔄 Obtener órdenes desde la BD
  const fetchOrdenes = async () => {
    try {
      const response = await axios.get(`${API_URL}/ordenesproveedor`);
      console.log("Órdenes recibidas:", response.data);
      if (response.data.success) {
        setOrdenes(response.data.ordenes); // Guardamos las órdenes en el state
      }
    } catch (error) {
      console.error(
        "❌ Error al obtener órdenes:",
        error.response?.data || error.message
      );
      alert("Error al obtener las órdenes. Revisa los detalles en la consola.");
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  // ❌ Eliminar orden
  const handleEliminar = async (id_orden) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta orden?");
    if (!confirmar) return;

    try {
      const response = await axios.delete(
        `${API_URL}/ordenesproveedor/${id_orden}`
      );
      if (response.data.success) {
        fetchOrdenes(); // recargar órdenes
      }
    } catch (error) {
      console.error("❌ Error al eliminar orden:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaOrden((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Actualizar la orden
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el ID de la orden de la que estamos actualizando los datos
    const idOrden = nuevaOrden.id_orden; // Este es el ID de la orden a actualizar

    try {
      const response = await axios.put(
        `${API_URL}/ordenesproveedor/${idOrden}`,
        {
          id_producto: nuevaOrden.id_producto,
          cantidad: nuevaOrden.cantidad,
          id_proveedor: nuevaOrden.id_proveedor,
          estado: nuevaOrden.estado,
          // Otros campos que puedan ser necesarios
        }
      );
      if (response.data.success) {
        fetchOrdenes(); // Recargar las órdenes
        setModalOpen(false);
        setNuevaOrden({
          producto: "",
          cantidad: "",
          proveedor: "",
          fechaOrden: "",
          estado: "pendiente",
        });
      }
    } catch (error) {
      console.error("❌ Error al agregar o actualizar orden:", error);
      alert("Hubo un error al agregar o actualizar la orden.");
    }
  };

  const handleEditClick = (orden) => {
    const productoSeleccionado = productos.find(
      (p) => p.nombre === orden.producto
    );
    const proveedorSeleccionado = proveedores.find(
      (p) => p.nombre === orden.proveedor
    );

    setNuevaOrden({
      id_orden: orden.id_orden,
      id_producto: productoSeleccionado?.id_producto || "",
      cantidad: orden.cantidad,
      id_proveedor: proveedorSeleccionado?.id_proveedor || "",
      fechaOrden: orden.fecha_orden?.slice(0, 10), // "2025-04-06"
      estado: orden.estado,
    });

    setModalOpen(true);
  };

  return (
    <div className="ordenes-compra-page">
      <Sidebar />

      <main className="main-content">
        <div className="ordenes-header">
          <h2>
            <FaClipboardList /> Órdenes de Compra
          </h2>
          <button className="btn-agregar" onClick={() => setModalOpen(true)}>
            <FaPlus /> Agregar Orden
          </button>
        </div>

        {/* Tabla de órdenes */}
        <div className="tabla-container">
          <table className="tabla-ordenes">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Fecha de Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id_orden}>
                  <td>{orden.producto}</td>
                  <td>{orden.cantidad}</td>
                  <td>{orden.proveedor}</td>
                  <td>{orden.estado}</td>
                  <td>{orden.fecha_orden || "N/A"}</td>
                  <td className="acciones">
                    <button
                      className="btn-editar"
                      onClick={() => handleEditClick(orden)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(orden.id_orden)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de agregar/editar orden */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {nuevaOrden.id_orden
                ? "Editar Orden de Compra"
                : "Agregar Orden de Compra"}
            </h3>
            <form onSubmit={handleSubmit}>
              <label>Producto</label>
              <select
                name="id_producto"
                value={nuevaOrden.id_producto}
                onChange={handleChange}
                required
              >
                {productos.map((producto) => (
                  <option
                    key={producto.id_producto}
                    value={producto.id_producto}
                  >
                    {producto.nombre}
                  </option>
                ))}
              </select>

              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={nuevaOrden.cantidad}
                onChange={handleChange}
                required
              />

              <label>Fecha de Orden</label>
              <input
                type="date"
                name="fechaOrden"
                value={nuevaOrden.fechaOrden}
                onChange={handleChange}
                required
              />

              <label>Proveedor</label>
              <select
                name="id_proveedor"
                value={nuevaOrden.id_proveedor}
                onChange={handleChange}
                required
              >
                {proveedores.map((proveedor) => (
                  <option
                    key={proveedor.id_proveedor}
                    value={proveedor.id_proveedor}
                  >
                    {proveedor.nombre}
                  </option>
                ))}
              </select>

              <label>Estado</label>
              <select
                name="estado"
                value={nuevaOrden.estado}
                onChange={handleChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="aceptada">Aceptada</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <button type="submit" className="btn-guardar">
                <FaPlus /> {nuevaOrden.id_orden ? "Actualizar" : "Agregar"}
              </button>
            </form>

            <button className="btn-cerrar" onClick={() => setModalOpen(false)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdenesCompra;
