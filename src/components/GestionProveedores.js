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
    // Asegúrate de que la fecha esté incluida en el objeto
    const proveedorConFecha = {
      ...nuevoProveedor,
      fecha_ultimo_abastecimiento:
        nuevoProveedor.fecha_ultimo_abastecimiento || null, // Si no se ha especificado, enviamos null
    };

    axios
      .post("http://localhost:5000/api/proveedores", proveedorConFecha)
      .then((res) => {
        if (res.data.success) {
          alert("Proveedor agregado correctamente.");
          setProveedores([...proveedores, proveedorConFecha]); // Agregar el nuevo proveedor a la lista
          setModalOpen(false);
          setNuevoProveedor({
            nombre: "",
            email: "",
            telefono: "",
            direccion: "",
            fecha_ultimo_abastecimiento: "", // Asegúrate de que la fecha esté vacía
          });
        }
      })
      .catch((err) => {
        console.error("❌ Error al agregar proveedor:", err);
        alert("Ocurrió un error al agregar el proveedor.");
      });
  };

  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const proveedorConFecha = {
      ...proveedorSeleccionado,
      fecha_ultimo_abastecimiento:
        proveedorSeleccionado.fecha_ultimo_abastecimiento || null,
    };

    axios
      .put(
        `http://localhost:5000/api/proveedores/${proveedorSeleccionado.id_proveedor}`,
        proveedorConFecha
      )
      .then((res) => {
        if (res.data.success) {
          alert("Proveedor actualizado correctamente.");
          const updatedProveedores = proveedores.map((prov) =>
            prov.id_proveedor === proveedorSeleccionado.id_proveedor
              ? proveedorConFecha
              : prov
          );
          setProveedores(updatedProveedores);
          setEditModalOpen(false);
        }
      })
      .catch((err) => {
        console.error("❌ Error al editar proveedor:", err);
        alert("Ocurrió un error al editar el proveedor.");
      });
  };

  const handleEditChange = (e) => {
    setProveedorSeleccionado({
      ...proveedorSeleccionado,
      [e.target.name]: e.target.value,
    });
  };

  const eliminarProveedor = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      axios
        .delete(`http://localhost:5000/api/proveedores/${id}`)
        .then((res) => {
          if (res.data.success) {
            alert("Proveedor eliminado correctamente.");
            setProveedores(proveedores.filter((p) => p.id_proveedor !== id));
          }
        })
        .catch((err) => {
          console.error("❌ Error al eliminar proveedor:", err);
          alert("Ocurrió un error al eliminar el proveedor.");
        });
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
              {proveedores && proveedores.length > 0 ? (
                proveedores.map((proveedor, index) => (
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
                        onClick={() =>
                          eliminarProveedor(proveedor.id_proveedor)
                        }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No se encontraron proveedores</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Agregar/Editar Proveedor */}
      {(modalOpen || editModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {editModalOpen ? "Editar Proveedor" : "Agregar Proveedor"}
              </h3>
              <button
                className="btn-cerrar"
                onClick={
                  editModalOpen
                    ? () => setEditModalOpen(false)
                    : () => setModalOpen(false)
                }
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={editModalOpen ? handleEditSubmit : handleSubmit}>
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={
                    editModalOpen
                      ? proveedorSeleccionado.nombre
                      : nuevoProveedor.nombre
                  }
                  onChange={editModalOpen ? handleEditChange : handleChange}
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={
                    editModalOpen
                      ? proveedorSeleccionado.email
                      : nuevoProveedor.email
                  }
                  onChange={editModalOpen ? handleEditChange : handleChange}
                />

                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={
                    editModalOpen
                      ? proveedorSeleccionado.telefono
                      : nuevoProveedor.telefono
                  }
                  onChange={editModalOpen ? handleEditChange : handleChange}
                />

                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={
                    editModalOpen
                      ? proveedorSeleccionado.direccion
                      : nuevoProveedor.direccion
                  }
                  onChange={editModalOpen ? handleEditChange : handleChange}
                />

                <label>Último Abastecimiento</label>
                <input
                  type="date"
                  name="fecha_ultimo_abastecimiento"
                  value={
                    editModalOpen
                      ? proveedorSeleccionado.fecha_ultimo_abastecimiento || ""
                      : nuevoProveedor.fecha_ultimo_abastecimiento || ""
                  }
                  onChange={editModalOpen ? handleEditChange : handleChange}
                />

                <button type="submit" className="btn-guardar">
                  {editModalOpen ? <FaEdit /> : <FaPlus />}{" "}
                  {editModalOpen ? "Editar" : "Agregar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProveedores;
