import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCrown,
} from "react-icons/fa";
import axios from "axios";
import "../styles.css";
import Sidebar from "./sidebar";

const API_URL = "http://localhost:5000/api"; // ❌ Si está en 8000, cambia a 5000

const Membresias = () => {
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);
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

  const filteredMembresias = membresias.filter((membresia) =>
    [
      membresia.nombre_cliente || "",
      membresia.email || "",
      membresia.nivel || "",
    ].some((campo) => campo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🔄 Cargar Clientes y Membresías desde la BD
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/clientes_membresias")
      .then((response) => {
        console.log("📋 Datos recibidos desde la API:", response.data);

        if (response.data && Array.isArray(response.data)) {
          setClientes(response.data);
        } else {
          console.warn("⚠ La API no devolvió un array válido.");
          setClientes([]);
        }
      })
      .catch((error) => {
        console.error("❌ Error al obtener los datos:", error);
        setClientes([]);
      });
  }, []);

  // 🟢 Abrir Modal para Agregar Membresía
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

  // 🟢 Abrir Modal para Editar Membresía
  const abrirModalEditar = (membresia) => {
    console.log("🛠 Intentando editar membresía:", membresia);

    if (!membresia.id_membresia) {
      console.error("🚨 Error: La membresía no tiene un ID válido", membresia);
      alert(
        "Error: No se puede editar esta membresía porque no tiene un ID válido."
      );
      return;
    }

    setEditingMembresia(membresia);
    setMembresiaForm({
      id_membresia: membresia.id_membresia, // 🟢 Asegura que se pase el ID de membresía
      id_cliente: membresia.id_cliente || "",
      nivel: membresia.nivel || "regular",
      fecha_inicio: membresia.fecha_inicio
        ? membresia.fecha_inicio.split("T")[0]
        : "",
      fecha_fin: membresia.fecha_fin ? membresia.fecha_fin.split("T")[0] : "",
      beneficios: membresia.beneficios || "",
    });

    console.log("📌 ID de membresía en formulario:", membresia.id_membresia);
    setModalVisible(true);
  };

  // 🔴 Cerrar Modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // ✅ Guardar Membresía (Agregar o Editar)
  const guardarMembresia = async () => {
    if (
      !membresiaForm.id_cliente ||
      !membresiaForm.fecha_inicio ||
      !membresiaForm.fecha_fin
    ) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      if (editingMembresia && membresiaForm.id_membresia) {
        console.log(
          `✏️ Actualizando membresía ID: ${membresiaForm.id_membresia}`
        );
        await axios.put(
          `${API_URL}/membresias/${membresiaForm.id_membresia}`,
          membresiaForm
        );
      } else {
        console.log("➕ Creando nueva membresía...");
        await axios.post(`${API_URL}/membresias`, membresiaForm);
      }

      const response = await axios.get(`${API_URL}/membresias`);
      setMembresias(response.data);
      cerrarModal();
    } catch (error) {
      console.error("❌ Error al guardar membresía:", error);
    }
  };

  // ❌ Eliminar Membresía
  const eliminarMembresia = async (id_membresia) => {
    if (window.confirm("¿Seguro que quieres eliminar esta membresía?")) {
      try {
        await axios.delete(`${API_URL}/membresias/${id_membresia}`);
        setMembresias(
          membresias.filter((m) => m.id_membresia !== id_membresia)
        );
      } catch (error) {
        console.error("❌ Error al eliminar membresía:", error);
      }
    }
  };

  const verMembresia = (membresia) => {
    alert(`
      Cliente: ${membresia.nombre_cliente}
      Email: ${membresia.email}
      Nivel: ${membresia.nivel}
      Inicio: ${new Date(membresia.fecha_inicio).toLocaleDateString()}
      Vencimiento: ${new Date(membresia.fecha_fin).toLocaleDateString()}
      Beneficios: ${membresia.beneficios}
    `);
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
            {clientes.length > 0 ? (
              clientes.map((cliente, index) => (
                <tr key={cliente.id_cliente}>
                  <td>{index + 1}</td>
                  <td>{cliente.nombre_cliente || "No disponible"}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.nivel_membresia}</td>
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
                      onClick={() => eliminarMembresia(cliente.id_cliente)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay clientes registrados
                </td>
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
              {/* Selección de Cliente */}
              <div className="input-group">
                <label>Cliente</label>
                <select
                  value={membresiaForm.id_cliente || ""}
                  onChange={(e) =>
                    setMembresiaForm({
                      ...membresiaForm,
                      id_cliente: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Seleccione un Cliente</option>
                  {clientes.length > 0 ? (
                    clientes.map((cliente) => (
                      <option
                        key={cliente.id_cliente}
                        value={cliente.id_cliente}
                      >
                        {cliente.nombre_cliente} ({cliente.email}) -{" "}
                        {cliente.nivel_membresia}
                      </option>
                    ))
                  ) : (
                    <option value="">No hay clientes disponibles</option>
                  )}
                </select>
              </div>

              {/* Nivel de Membresía */}
              <div className="input-group">
                <label>Nivel de Membresía</label>
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

              {/* Fechas de Inicio y Vencimiento */}
              <div className="input-group">
                <label>Fecha de Inicio</label>
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
                <label>Fecha de Vencimiento</label>
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

              {/* Beneficios */}
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
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membresias;
