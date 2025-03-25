import React, { useState, useEffect } from "react";
import axios from "axios"; // Asegúrate de tener axios instalado
import {
  FaTrash,
  FaPlus,
  FaEdit,
  FaTimes,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaClipboardList,
  FaEnvelope,
} from "react-icons/fa";
import Sidebar from "./sidebar";
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

  // ✅ Conexión real con base de datos
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/proveedores")
      .then((res) => {
        if (res.data.success) {
          setProveedores(res.data.proveedores);
        }
      })
      .catch((err) => {
        console.error("❌ Error al cargar proveedores:", err);
      });
  }, []);

  const handleChange = (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes hacer un POST si deseas guardarlo en la BD
    setModalOpen(false);
    setNuevoProveedor({ nombre: "", email: "", telefono: "", direccion: "" });
  };

  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
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
      <Sidebar />
      <div className="proveedores-header">
        <h2>📋 Gestión de Proveedores</h2>
        <button className="btn-agregar" onClick={() => setModalOpen(true)}>
          <FaPlus /> Agregar Proveedor
        </button>
      </div>

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
                  <td>
                    {proveedor.fecha_ultimo_abastecimiento
                      ? proveedor.fecha_ultimo_abastecimiento.split(" ")[0]
                      : "N/A"}
                  </td>
                  <td className="acciones">
                    <button
                      className="btn-accion editar"
                      onClick={() => handleEditClick(proveedor)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarProveedor(proveedor.id_proveedor)}
                    >
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
