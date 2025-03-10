import React, { useState } from "react";
import { FaSearch, FaPlus, FaFileExcel, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import * as XLSX from "xlsx";
import "../styles.css";
import Sidebar from "./sidebar";

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([
    {
      id_cliente: 1,
      nombre: "Carlos López",
      email: "carlos@example.com",
      telefono: "555-1234",
      direccion: "Av. Central 123",
      fecha_registro: "2024-01-15",
      nivel_membresia: "Gold",
    },
  ]);

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

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const guardarCliente = () => {
    if (!clienteForm.nombre || !clienteForm.email || !clienteForm.telefono || !clienteForm.direccion) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (editingClient) {
      setClientes(
        clientes.map((c) => (c.id_cliente === editingClient.id_cliente ? { ...c, ...clienteForm } : c))
      );
    } else {
      const id_cliente = clientes.length + 1;
      setClientes([
        ...clientes,
        { ...clienteForm, id_cliente, fecha_registro: new Date().toISOString().split("T")[0] },
      ]);
    }

    cerrarModal();
  };

  const eliminarCliente = (id_cliente) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      setClientes(clientes.filter((cliente) => cliente.id_cliente !== id_cliente));
    }
  };

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
            {clientes
              .filter((cliente) =>
                [cliente.nombre, cliente.email, cliente.nivel_membresia].some((campo) =>
                  campo.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .map((cliente, index) => (
                <tr key={cliente.id_cliente}>
                  <td>{index + 1}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.fecha_registro}</td>
                  <td>{cliente.nivel_membresia}</td>
                  <td>{cliente.frecuencia_compra}</td>
                  <td className="acciones">
                    <button className="btn-editar" onClick={() => abrirModalEditar(cliente)}>
                      <FaEdit />
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarCliente(cliente.id_cliente)}>
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
            <h3>{editingClient ? "Editar Cliente" : "Agregar Cliente"}</h3>
            <div className="modal-form">
              <input type="text" placeholder="Nombre" value={clienteForm.nombre} onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })} />
              <input type="email" placeholder="Email" value={clienteForm.email} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} />
              <input type="text" placeholder="Teléfono" value={clienteForm.telefono} onChange={(e) => setClienteForm({ ...clienteForm, telefono: e.target.value })} />
              <input type="text" placeholder="Dirección" value={clienteForm.direccion} onChange={(e) => setClienteForm({ ...clienteForm, direccion: e.target.value })} />
            </div>
            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarCliente}>Guardar</button>
              <button className="btn-cerrar" onClick={cerrarModal}><FaTimes /> Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
