import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaClipboardList
} from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Se importa el Sidebar
import "../ordenesCompra.css";

const OrdenesCompra = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenes, setOrdenes] = useState([
    {
      id: 1,
      producto: "Cómic Batman #100",
      cantidad: 20,
      proveedor: "Editorial DC",
      estado: "Pendiente",
      fecha: "2025-03-06",
    },
    {
      id: 2,
      producto: "Manga One Piece Vol. 50",
      cantidad: 15,
      proveedor: "Editorial Shueisha",
      estado: "Procesada",
      fecha: "2025-03-04",
    },
  ]);

  const handleEliminar = (id) => {
    const confirmacion = window.confirm(
      "¿Seguro que deseas eliminar esta orden de compra?"
    );
    if (confirmacion) {
      setOrdenes(ordenes.filter((orden) => orden.id !== id));
    }
  };

  return (
    <div className="ordenes-compra-page">
      <Sidebar /> {/* ✅ Se muestra el sidebar importado */}

      {/* Contenido principal */}
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
                <tr key={orden.id}>
                  <td>{orden.producto}</td>
                  <td>{orden.cantidad}</td>
                  <td>{orden.proveedor}</td>
                  <td>{orden.estado}</td>
                  <td>{orden.fecha}</td>
                  <td className="acciones">
                    <button className="btn-editar">
                      <FaEdit />
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(orden.id)}>
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
