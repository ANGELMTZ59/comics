import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaClipboardList } from "react-icons/fa";
import Sidebar from "./sidebar";
import "../ordenesCompra.css";

const API_URL = "http://localhost:5000/api";

const OrdenesCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // 🔄 Obtener órdenes desde la BD
  const fetchOrdenes = async () => {
    try {
      const response = await axios.get(`${API_URL}/ordenesproveedor`);
      if (response.data.success) {
        setOrdenes(response.data.ordenes);
      }
    } catch (error) {
      console.error("❌ Error al obtener órdenes:", error);
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
                <th>Fecha</th>
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
                  <td>{orden.fecha_entrega_real || "Pendiente"}</td>
                  <td className="acciones">
                    <button className="btn-editar">
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
    </div>
  );
};

export default OrdenesCompra;
