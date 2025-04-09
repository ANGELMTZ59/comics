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

const API_URL = "https://fastapi-my17.onrender.com/api"; // updated URL

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
    id_usuario: "", // Nuevo campo para el empleado que solicita la orden
  });

  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const usuarioAutenticado = 1; // Simula el ID del usuario autenticado

  useEffect(() => {
    setNuevaOrden((prevState) => ({
      ...prevState,
      id_usuario: usuarioAutenticado, // Asigna el ID del usuario autenticado
    }));
  }, [usuarioAutenticado]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${API_URL}/usuarios`);
        if (response.data.success) {
          setUsuarios(response.data.usuarios);
        }
      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

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

  const guardarOrden = async () => {
    if (
      !nuevaOrden.id_producto ||
      !nuevaOrden.cantidad ||
      !nuevaOrden.id_proveedor ||
      !nuevaOrden.estado ||
      !nuevaOrden.id_usuario
    ) {
      alert(
        "⚠️ Por favor, complete todos los campos obligatorios antes de continuar."
      );
      return;
    }

    try {
      if (nuevaOrden.id_orden) {
        // Actualizar orden existente
        const response = await axios.put(
          `${API_URL}/ordenesproveedor/${nuevaOrden.id_orden}`,
          nuevaOrden
        );
        if (response.data.success) {
          alert("✅ La orden de compra ha sido actualizada exitosamente.");
        } else {
          alert(
            "❌ Ocurrió un error al intentar actualizar la orden de compra. Por favor, intente nuevamente."
          );
        }
      } else {
        // Crear nueva orden
        const response = await axios.post(
          `${API_URL}/ordenesproveedor`,
          nuevaOrden
        );
        if (response.data.success) {
          alert("✅ La nueva orden de compra ha sido creada exitosamente.");
        } else {
          alert(
            "❌ Ocurrió un error al intentar crear la orden de compra. Por favor, intente nuevamente."
          );
        }
      }

      setModalOpen(false);
      setNuevaOrden({
        id_producto: "",
        cantidad: "",
        id_proveedor: "",
        fechaOrden: "",
        estado: "pendiente",
        id_usuario: usuarioAutenticado, // Restablece el ID del usuario autenticado
      });
      fetchOrdenes(); // Refrescar las órdenes después de agregar o editar
    } catch (error) {
      console.error("❌ Error al guardar la orden:", error);
      alert(
        "❌ Ha ocurrido un error inesperado al procesar la solicitud. Por favor, revise los detalles en la consola o intente nuevamente."
      );
    }
  };

  const handleEditClick = (orden) => {
    setNuevaOrden({
      id_orden: orden.id_orden, // Incluye el ID de la orden para la edición
      id_producto:
        productos.find((p) => p.nombre === orden.producto)?.id_producto || "",
      cantidad: orden.cantidad,
      id_proveedor:
        proveedores.find((p) => p.nombre === orden.proveedor)?.id_proveedor ||
        "",
      fechaOrden: orden.fecha_orden?.slice(0, 10), // Formato YYYY-MM-DD
      estado: orden.estado,
      id_usuario:
        usuarios.find((u) => u.nombre === orden.usuario)?.id_usuario || "",
    });
    setModalOpen(true); // Abre el modal para editar
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
                <th>Usuario</th>
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
                  <td>
                    {orden.fecha_orden
                      ? new Date(orden.fecha_orden).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{orden.usuario || "Desconocido"}</td>{" "}
                  {/* Muestra el nombre del usuario */}
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
                : "Agregar Nueva Orden de Compra"}
            </h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>Producto</label>
              <select
                name="id_producto"
                value={nuevaOrden.id_producto}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un producto</option>
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
                <option value="">Seleccione un proveedor</option>
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

              <label>Usuario</label>
              <select
                name="id_usuario"
                value={nuevaOrden.id_usuario}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn-guardar"
                onClick={guardarOrden}
              >
                {nuevaOrden.id_orden ? "Guardar Cambios" : "Crear Orden"}
              </button>
            </form>

            <button className="btn-cerrar" onClick={() => setModalOpen(false)}>
              <FaTimes /> Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdenesCompra;
