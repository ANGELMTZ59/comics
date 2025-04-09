import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../styles.css";
import Sidebar from "./sidebar";

const API_URL = "https://fastapi-my17.onrender.com/api"; // updated URL

const Membresias = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMembresia, setEditingMembresia] = useState(null);

  const [membresiaForm, setMembresiaForm] = useState({
    id_cliente: "",
    nivel: "regular",
    fecha_inicio: "",
    fecha_fin: "",
    beneficios: "",
  });

  const filteredClientes = clientes.filter((cliente) =>
    [
      cliente.nombre_cliente || "",
      cliente.email || "",
      cliente.nivel_membresia || "",
    ].some((campo) => campo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🔄 Obtener todos los clientes con membresía
  const recargarClientesConMembresias = async () => {
    try {
      const response = await axios.get(`${API_URL}/clientes_membresias`);
      if (Array.isArray(response.data)) {
        setClientes(response.data);
        console.log("📦 Clientes actualizados:", response.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    recargarClientesConMembresias();
  }, []);

  // 🟢 Abrir modal de agregar
  const abrirModalAgregar = () => {
    setEditingMembresia(null);
    setMembresiaForm({
      id_cliente: "",
      nivel: "regular",
      fecha_inicio: "",
      fecha_fin: "",
      beneficios: "",
    });
    setModalVisible(true);
  };

  // 🟢 Abrir modal de editar
  const abrirModalEditar = (cliente) => {
    if (!cliente.id_membresia) {
      alert("⚠️ Este cliente aún no tiene membresía para editar.");
      return;
    }

    setEditingMembresia(cliente);
    setMembresiaForm({
      id_membresia: cliente.id_membresia,
      id_cliente: cliente.id_cliente,
      nivel: cliente.nivel_membresia || "regular",
      fecha_inicio: cliente.fecha_inicio?.split("T")[0] || "",
      fecha_fin: cliente.fecha_fin?.split("T")[0] || "",
      beneficios: cliente.beneficios || "",
    });
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  // ✅ Guardar membresía (agregar o editar)
  const guardarMembresia = async () => {
    const { id_cliente, fecha_inicio, fecha_fin } = membresiaForm;

    if (!id_cliente || !fecha_inicio || !fecha_fin) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      if (editingMembresia && membresiaForm.id_membresia) {
        await axios.put(
          `${API_URL}/membresias/${membresiaForm.id_membresia}`,
          membresiaForm
        );
      } else {
        await axios.post(`${API_URL}/membresias`, membresiaForm);
      }

      await recargarClientesConMembresias();
      cerrarModal();
    } catch (error) {
      console.error("❌ Error al guardar membresía:", error);
      alert("Hubo un error al guardar la membresía.");
    }
  };

  // ❌ Eliminar membresía
  // ❌ Eliminar Membresía
  const eliminarMembresia = async (id_membresia) => {
    if (!id_membresia) {
      console.error("❌ No se puede eliminar: ID de membresía no válido");
      return;
    }

    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta membresía?")
    ) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/membresias/${id_membresia}`);

      // 🧼 Limpiar manualmente la membresía del cliente en el estado local
      setClientes((prevClientes) =>
        prevClientes.map((c) =>
          c.id_membresia === id_membresia
            ? {
                ...c,
                id_membresia: null,
                nivel_membresia: "Sin membresía",
                fecha_inicio: null,
                fecha_fin: null,
                beneficios: "Sin beneficios",
              }
            : c
        )
      );

      // ✅ Asegúrate también de recargar desde la BD por si hay cambios externos
      await recargarClientesConMembresias();

      alert("✅ Membresía eliminada correctamente");
    } catch (error) {
      console.error("❌ Error al eliminar membresía:", error);
    }
  };

  return (
    <div className="membresias-container">
      <Sidebar />
      <div className="titulo-y-boton">
        <h2>📜 Gestión de Membresías</h2>
        <button className="btn-agregar" onClick={abrirModalAgregar}>
          <FaPlus /> Agregar Membresía
        </button>
      </div>

      <div className="buscador">
        <FaSearch className="icono-busqueda" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o membresía..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tabla-container">
        <table className="membresias-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Nivel</th>
              <th>Inicio</th>
              <th>Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente, index) => (
                <tr key={cliente.id_cliente}>
                  <td>{index + 1}</td>
                  <td>{cliente.nombre_cliente}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.nivel_membresia || "Sin membresía"}</td>
                  <td>
                    {cliente.fecha_inicio
                      ? new Date(cliente.fecha_inicio).toLocaleDateString()
                      : "Sin fecha"}
                  </td>
                  <td>
                    {cliente.fecha_fin
                      ? new Date(cliente.fecha_fin).toLocaleDateString()
                      : "Sin fecha"}
                  </td>
                  <td className="acciones">
                    <button
                      className="btn-editar"
                      onClick={() => abrirModalEditar(cliente)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarMembresia(cliente.id_membresia)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay clientes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {editingMembresia ? "Editar Membresía" : "Agregar Membresía"}
            </h3>

            <div className="modal-form">
              {/* Cliente */}
              <div className="input-group">
                <label>Cliente</label>
                <select
                  value={membresiaForm.id_cliente}
                  onChange={(e) =>
                    setMembresiaForm({
                      ...membresiaForm,
                      id_cliente: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre_cliente} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nivel */}
              <div className="input-group">
                <label>Nivel</label>
                <select
                  value={membresiaForm.nivel}
                  onChange={(e) =>
                    setMembresiaForm({
                      ...membresiaForm,
                      nivel: e.target.value,
                    })
                  }
                >
                  <option value="regular">Regular</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>

              {/* Fechas */}
              <div className="input-group">
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  value={membresiaForm.fecha_inicio}
                  onChange={(e) =>
                    setMembresiaForm({
                      ...membresiaForm,
                      fecha_inicio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Fecha Fin</label>
                <input
                  type="date"
                  value={membresiaForm.fecha_fin}
                  onChange={(e) =>
                    setMembresiaForm({
                      ...membresiaForm,
                      fecha_fin: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Beneficios</label>
                <textarea
                  value={membresiaForm.beneficios}
                  onChange={(e) =>
                    setMembresiaForm({
                      ...membresiaForm,
                      beneficios: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarMembresia}>
                Guardar
              </button>
              <button className="btn-cerrar" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membresias;
