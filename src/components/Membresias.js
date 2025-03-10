import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";
import Sidebar from "./sidebar";

const Membresias = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMembresia, setEditingMembresia] = useState(null);

  const [membresiaForm, setMembresiaForm] = useState({
    nombre: "",
    email: "",
    nivel: "regular",
    inicio: "",
    vencimiento: "",
  });

  const [membresias, setMembresias] = useState([
    {
      id: 1,
      nombre: "Carlos López",
      email: "carlos@example.com",
      nivel: "Gold",
      inicio: "2024-01-15",
      vencimiento: "2025-01-15",
      beneficios: "10% de descuento en compras y acceso a eventos exclusivos",
    },
    {
      id: 2,
      nombre: "María González",
      email: "maria@example.com",
      nivel: "Platinum",
      inicio: "2023-12-10",
      vencimiento: "2024-12-10",
      beneficios: "Envío gratis y descuentos exclusivos",
    },
  ]);

  // 🔄 Cargar Membresías desde el Backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Error al obtener clientes:", error));

    axios
      .get("http://localhost:8000/api/membresias")
      .then((response) => setMembresias(response.data))
      .catch((error) => console.error("Error al obtener membresías:", error));
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
    setEditingMembresia(membresia);
    setMembresiaForm({
      nombre_cliente: membresia.nombre_cliente,
      email: membresia.email,
      nivel: membresia.nivel,
      fecha_inicio: membresia.fecha_inicio,
      fecha_fin: membresia.fecha_fin,
      beneficios: membresia.beneficios,
    });
    setModalVisible(true);
  };

  // 🔴 Cerrar Modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // ✅ Guardar Membresía (Agregar o Editar)
  const guardarMembresia = async () => {
    if (
      !membresiaForm.nombre_cliente ||
      !membresiaForm.fecha_inicio ||
      !membresiaForm.fecha_fin
    ) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      if (editingMembresia) {
        await axios.put(
          `http://localhost:8000/api/membresias/${editingMembresia.id_membresia}`,
          membresiaForm
        );
      } else {
        await axios.post("http://localhost:8000/api/membresias", membresiaForm);
      }

      const response = await axios.get("http://localhost:8000/api/membresias");
      setMembresias(response.data);
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar membresía:", error);
    }
  };

  // ❌ Eliminar Membresía
  const eliminarMembresia = async (id_membresia) => {
    if (window.confirm("¿Seguro que quieres eliminar esta membresía?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/membresias/${id_membresia}`
        );
        setMembresias(
          membresias.filter((m) => m.id_membresia !== id_membresia)
        );
      } catch (error) {
        console.error("Error al eliminar membresía:", error);
      }
    }
  };

  const verMembresia = (membresia) => {
    alert(`
      Cliente: ${membresia.nombre}
      Email: ${membresia.email}
      Nivel: ${membresia.nivel}
      Inicio: ${membresia.fecha_inicio}
      Vencimiento: ${membresia.fecha_fin}
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
            {membresias
              .filter((m) =>
                `${m.nombre} ${m.email} ${m.nivel}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((membresia, index) => (
                <tr key={membresia.id_membresia}>
                  <td>{index + 1}</td>
                  <td>{membresia.nombre}</td>
                  <td>{membresia.email}</td>
                  <td>
                    <FaCrown className="icono-membresia" /> {membresia.nivel}
                  </td>
                  <td>{new Date(membresia.fecha_inicio).toLocaleDateString()}</td>
                  <td>{new Date(membresia.fecha_fin).toLocaleDateString()}</td>
                  <td className="acciones">
                    <button className="btn-ver" onClick={() => verMembresia(membresia)}>
                      <FaEye />
                    </button>
                    <button className="btn-editar" onClick={() => abrirModalEditar(membresia)}>
                      <FaEdit />
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarMembresia(membresia.id_membresia)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalVisible && (
  <div className="modal">
    <div className="modal-content">
      <h3>{editingMembresia ? "Editar Membresía" : "Agregar Membresía"}</h3>

      <div className="modal-form">
        {/* Selección de Cliente */}
        <div className="input-group">
          <label>Cliente</label>
          <select
            value={membresiaForm.id_cliente}
            onChange={(e) =>
              setMembresiaForm({
                ...membresiaForm,
                id_cliente: e.target.value,
              })
            }
          >
            <option value="">Seleccione un Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </option>
            ))}
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

        {/* Fecha de Inicio */}
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

        {/* Fecha de Vencimiento */}
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
            rows="3"
            value={membresiaForm.beneficios}
            onChange={(e) =>
              setMembresiaForm({
                ...membresiaForm,
                beneficios: e.target.value,
              })
            }
          ></textarea>
        </div>
      </div>

      {/* Botones de Acción */}
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
