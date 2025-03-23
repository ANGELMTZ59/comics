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
        const response = await axios.get("http://localhost:5000/api/clientes");
        console.log("🔍 Respuesta de API clientes:", response.data);

        if (response.data.success && Array.isArray(response.data.clientes)) {
          setClientes(response.data.clientes);
          console.log(
            "✅ Clientes guardados en estado:",
            response.data.clientes
          );
        } else {
          console.warn("⚠ No se encontraron clientes válidos en la API");
          setClientes([]); // Limpia el estado si la respuesta no es válida
        }
      } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        setClientes([]);
      }
    };

    fetchClientes(); // ✅ Aquí llamamos a la función
  }, []); // ✅ El arreglo vacío indica que solo se ejecuta una vez al montar

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
      !clienteForm.direccion
    ) {
      alert("⚠️ Por favor, completa todos los campos.");
      return;
    }

    try {
      if (editingClient) {
        // Si estamos editando, enviamos una petición PUT al servidor
        const response = await axios.put(
          `${API_URL}/clientes/${editingClient.id_cliente}`,
          clienteForm
        );

        if (response.data.success) {
          setClientes(
            clientes.map((c) =>
              c.id_cliente === editingClient.id_cliente
                ? { ...c, ...clienteForm }
                : c
            )
          );
          alert("✅ Cliente actualizado correctamente");
        } else {
          alert("❌ Error al actualizar el cliente");
        }
      } else {
        // Si es un nuevo cliente, enviamos una petición POST para agregarlo
        const response = await axios.post(`${API_URL}/clientes`, clienteForm);

        if (response.data.success) {
          setClientes([...clientes, response.data.cliente]);
          alert("✅ Cliente agregado correctamente");
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
    if (!clienteEditado.id_cliente) {
      alert("Cliente no tiene un ID válido");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/clientes/${clienteEditado.id_cliente}`,
        clienteEditado
      );
      alert("✅ Cliente editado correctamente");
    } catch (error) {
      console.error("❌ Error al guardar cliente:", error);
    }
  };

  // 🗑 Eliminar cliente
  const eliminarCliente = async (id_cliente) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este cliente?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/clientes/${id_cliente}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success) {
        // 🔹 Eliminar cliente del estado local
        setClientes(
          clientes.filter((cliente) => cliente.id_cliente !== id_cliente)
        );
        alert("✅ Cliente eliminado correctamente");
      } else {
        alert("❌ Error al eliminar el cliente");
      }
    } catch (error) {
      console.error("❌ Error al eliminar cliente:", error);
      alert("❌ Error en el servidor");
    }
  };

  // 📥 Exportar a Excel
  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "Clientes.xlsx");
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
                .filter((cliente) =>
                  [cliente.nombre, cliente.email, cliente.nivel_membresia]
                    .filter(Boolean) // 🔹 Evita errores si alguna clave es null
                    .some((campo) =>
                      campo.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
                .map((cliente, index) => (
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
                        onClick={() => abrirModalEditar(cliente)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarCliente(cliente.id_cliente)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
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
