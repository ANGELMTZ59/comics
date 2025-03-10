import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaEdit, FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaClipboardList, FaEnvelope } from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Se importa el Sidebar
import "../proveedores.css";

const GestionProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    setProveedores([
      {
        id_proveedor: 1,
        nombre: "Marvel Comics",
        email: "contacto@marvel.com",
        telefono: "555-1234",
        direccion: "Av. Superhéroes 123",
        fecha_ultimo_abastecimiento: "2025-02-20",
      },
      {
        id_proveedor: 2,
        nombre: "DC Comics",
        email: "contacto@dc.com",
        telefono: "555-5678",
        direccion: "Gotham 456",
        fecha_ultimo_abastecimiento: "2025-02-22",
      },
      {
        id_proveedor: 3,
        nombre: "Hasbro",
        email: "ventas@hasbro.com",
        telefono: "555-9876",
        direccion: "Juguetes 789",
        fecha_ultimo_abastecimiento: "2025-02-25",
      },
    ]);
  }, []);

  const handleChange = (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProveedores([
      ...proveedores,
      {
        ...nuevoProveedor,
        id_proveedor: proveedores.length + 1,
        fecha_ultimo_abastecimiento: "N/A",
      },
    ]);
    setModalOpen(false);
    setNuevoProveedor({ nombre: "", email: "", telefono: "", direccion: "" });
  };

  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProveedores(
      proveedores.map((p) =>
        p.id_proveedor === proveedorSeleccionado.id_proveedor
          ? proveedorSeleccionado
          : p
      )
    );
    setEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    setProveedorSeleccionado({
      ...proveedorSeleccionado,
      [e.target.name]: e.target.value,
    });
  };

  const eliminarProveedor = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      setProveedores(proveedores.filter((p) => p.id_proveedor !== id));
    }
  };

  return (
    <div className="proveedores-page">
      <Sidebar /> {/* ✅ Sidebar importado */}

      <div className="proveedores-header">
        <h2>📋 Gestión de Proveedores</h2>
        <button className="btn-agregar" onClick={() => setModalOpen(true)}>
          <FaPlus /> Agregar Proveedor
        </button>
      </div>

      {/* Modal para agregar proveedor */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setModalOpen(false)}>
              <FaTimes />
            </button>
            <h2>
              <FaClipboardList className="form-icon" /> Agregar Proveedor
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <FaPhone className="input-icon" />
                <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <FaMapMarkerAlt className="input-icon" />
                <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
              </div>
              <button type="submit" className="btn-registrar">Registrar Proveedor</button>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de proveedores */}
      <div className="table-wrapper">
        <div className="proveedores-container">
          <table className="proveedores-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Último Abastecimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor, index) => (
                <tr key={proveedor.id_proveedor}>
                  <td>{index + 1}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.email}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.direccion}</td>
                  <td>{proveedor.fecha_ultimo_abastecimiento || "N/A"}</td>
                  <td className="acciones">
                    <button className="btn-accion editar" onClick={() => handleEditClick(proveedor)}>
                      <FaEdit />
                    </button>
                    <button className="btn-accion eliminar" onClick={() => eliminarProveedor(proveedor.id_proveedor)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionProveedores;
