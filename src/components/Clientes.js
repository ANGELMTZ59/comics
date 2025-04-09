import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaFileExcel,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import axios from "axios";
import "../styles.css";
import Sidebar from "./sidebar";

const API_URL = "http://localhost:5000/api"; // Asegúrate de que esta URL coincida con tu servidor

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    nivel_membresia: "regular",
    frecuencia_compra: "baja",
  });

  // 📌 Cargar clientes desde la BD
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          "https://fastapi-my17.onrender.com/api/clientes"
        );
        if (response.data.success && Array.isArray(response.data.clientes)) {
          setClientes(response.data.clientes);
        } else {
          setClientes([]); // Limpia el estado si no hay datos válidos
        }
      } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        setClientes([]);
      }
    };

    fetchClientes(); // ✅ Aquí llamamos a la función
  }, []); // ✅ El arreglo vacío indica que solo se ejecuta una vez al montar

  // Add a refresh function to reload the client list
  const refreshClientes = async () => {
    try {
      const response = await axios.get(
        "https://fastapi-my17.onrender.com/api/clientes"
      );
      if (response.data.success) {
        setClientes(response.data.clientes); // ✅ Aquí está el arreglo correcto
      } else {
        setClientes([]); // Si no hay éxito, vacía la lista
      }
    } catch (error) {
      console.error("❌ Error al refrescar clientes:", error);
      setClientes([]);
    }
  };

  const abrirModalAgregar = () => {
    setEditingClient(null);
    setClienteForm({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      nivel_membresia: "regular",
      frecuencia_compra: "baja",
    });
    setModalVisible(true);
  };

  const abrirModalEditar = (cliente) => {
    setEditingClient(cliente);
    setClienteForm({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      fecha_registro: cliente.fecha_registro
        ? cliente.fecha_registro.split("T")[0]
        : "", // Formato 'YYYY-MM-DD'
      nivel_membresia: cliente.nivel_membresia,
      frecuencia_compra: cliente.frecuencia_compra,
    });
    setModalVisible(true);
  };

  const [clienteEditado, setClienteEditado] = useState({
    id_cliente: "",
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    nivel_membresia: "",
    frecuencia_compra: "",
  });

  const cerrarModal = () => {
    setModalVisible(false);
  };

  // ✅ Guardar cliente (Nuevo o Editado)
  const guardarCliente = async () => {
    if (
      !clienteForm.nombre ||
      !clienteForm.email ||
      !clienteForm.telefono ||
      !clienteForm.direccion ||
      !clienteForm.fecha_registro
    ) {
      alert("⚠️ Por favor, completa todos los campos.");
      return;
    }

    try {
      if (editingClient) {
        // Editar cliente
        const response = await axios.put(
          `https://fastapi-my17.onrender.com/api/clientes/${editingClient.id_cliente}`,
          clienteForm
        );
        if (response.data.success) {
          alert("✅ Cliente editado correctamente");
          refreshClientes(); // Refrescar lista después de editar
        } else {
          alert("❌ Error al editar el cliente");
        }
      } else {
        // Agregar cliente
        const response = await axios.post(
          "https://fastapi-my17.onrender.com/api/clientes",
          clienteForm
        );
        if (response.data.success) {
          alert("✅ Cliente agregado correctamente");
          refreshClientes(); // Refrescar lista después de agregar
        } else {
          alert("❌ Error al agregar el cliente");
        }
      }
      cerrarModal();
    } catch (error) {
      console.error("❌ Error al guardar cliente:", error);
      alert("❌ Error en el servidor");
    }
  };

  const editarCliente = async () => {
    // Verifica si el cliente tiene un ID válido
    if (!clienteEditado.id_cliente) {
      alert("Cliente no tiene un ID válido");
      return;
    }

    // Verifica si el objeto clienteEditado tiene los campos necesarios
    if (
      !clienteEditado.nombre ||
      !clienteEditado.email ||
      !clienteEditado.telefono ||
      !clienteEditado.direccion
    ) {
      alert("⚠️ Por favor, completa todos los campos.");
      return;
    }

    // Verifica que los datos sean correctos antes de enviarlos
    console.log("Cliente a editar:", clienteEditado);

    try {
      // Realiza la solicitud PUT
      const response = await axios.put(
        `https://fastapi-my17.onrender.com/api/clientes/${clienteEditado.id_cliente}`,
        clienteEditado
      );
      // Si la solicitud es exitosa
      alert("✅ Cliente editado correctamente");
    } catch (error) {
      console.error("❌ Error al editar cliente:", error);
      alert("❌ Error al editar cliente. Intenta de nuevo.");
    }
  };

  // 📥 Exportar a Excel
  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "Clientes.xlsx");
  };

  const eliminarCliente = async (id_cliente) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        const response = await axios.delete(
          `https://fastapi-my17.onrender.com/api/clientes/${id_cliente}`
        );
        if (response.data.success) {
          alert("✅ Cliente eliminado correctamente");
          refreshClientes(); // Refrescar la lista de clientes
        } else {
          alert("❌ Error al eliminar el cliente");
        }
      } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        alert("❌ Error al eliminar cliente");
      }
    }
  };

  return (
    <div className="clientes-page">
      <Sidebar />
      <div className="header-clientes">
        <h2>📜 Gestión de Clientes</h2>
        <div className="botones-clientes">
          <button className="btn-agregar" onClick={abrirModalAgregar}>
            <FaPlus /> Agregar Cliente
          </button>
          <button className="btn-exportar" onClick={exportarExcel}>
            📥 Exportar a Excel
          </button>
        </div>
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
        <table className="clientes-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Registro</th>
              <th>Membresía</th>
              <th>Frecuencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes && clientes.length > 0 ? (
              clientes
                .filter((cliente) => cliente && cliente.nombre && cliente.email)
                .filter((cliente) =>
                  [cliente.nombre, cliente.email, cliente.nivel_membresia]
                    .filter(Boolean)
                    .some((campo) =>
                      campo.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
                .map(
                  (
                    cliente,
                    index // Aquí estás usando correctamente 'cliente'
                  ) => (
                    <tr key={cliente.id_cliente}>
                      <td>{index + 1}</td>
                      <td>{cliente.nombre || "No disponible"}</td>
                      <td>{cliente.email || "Sin email"}</td>
                      <td>{cliente.telefono || "Sin teléfono"}</td>
                      <td>{cliente.direccion || "Sin dirección"}</td>
                      <td>
                        {cliente.fecha_registro
                          ? new Date(cliente.fecha_registro).toLocaleDateString(
                              "es-MX"
                            )
                          : "Sin registro"}
                      </td>
                      <td>{cliente.nivel_membresia || "Sin nivel"}</td>
                      <td>{cliente.frecuencia_compra || "Desconocida"}</td>
                      <td className="acciones">
                        <button
                          className="btn-editar"
                          onClick={() => abrirModalEditar(cliente)} // Usas 'cliente' aquí
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarCliente(cliente.id_cliente)} // Y también aquí
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  )
                )
            ) : (
              <tr>
                <td colSpan="9">⚠ No hay clientes disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingClient ? "Editar Cliente" : "Agregar Cliente"}</h3>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Nombre"
                value={clienteForm.nombre}
                onChange={(e) =>
                  setClienteForm({ ...clienteForm, nombre: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={clienteForm.email}
                onChange={(e) =>
                  setClienteForm({ ...clienteForm, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={clienteForm.telefono}
                onChange={(e) =>
                  setClienteForm({ ...clienteForm, telefono: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Dirección"
                value={clienteForm.direccion}
                onChange={(e) =>
                  setClienteForm({ ...clienteForm, direccion: e.target.value })
                }
              />

              <input
                type="date"
                placeholder="Fecha de Registro"
                value={
                  clienteForm.fecha_registro
                    ? clienteForm.fecha_registro.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setClienteForm({
                    ...clienteForm,
                    fecha_registro: e.target.value,
                  })
                }
              />

              <select
                value={clienteForm.nivel_membresia}
                onChange={(e) =>
                  setClienteForm({
                    ...clienteForm,
                    nivel_membresia: e.target.value,
                  })
                }
              >
                <option value="regular">Regular</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>

              <select
                value={clienteForm.frecuencia_compra}
                onChange={(e) =>
                  setClienteForm({
                    ...clienteForm,
                    frecuencia_compra: e.target.value,
                  })
                }
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarCliente}>
                Guardar
              </button>
              <button className="btn-cerrar" onClick={cerrarModal}>
                <FaTimes /> Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
