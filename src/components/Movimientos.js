import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Se importa el Sidebar
import "../styles.css";

const Movimientos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [movimientos, setMovimientos] = useState([
    {
      id_movimiento: 1,
      tipo_movimiento: "Entrada",
      producto: "Cómic Batman #100",
      cantidad: 10,
      empleado: "Juan Pérez",
      fecha_movimiento: "2025-03-05",
    },
    {
      id_movimiento: 2,
      tipo_movimiento: "Salida",
      producto: "Manga One Piece Vol. 50",
      cantidad: 5,
      empleado: "María López",
      fecha_movimiento: "2025-03-04",
    },
  ]);

  const [movimientoForm, setMovimientoForm] = useState({
    tipo_movimiento: "Entrada",
    producto: "",
    cantidad: "",
    empleado: "",
  });

  const abrirModal = (movimiento = null) => {
    if (movimiento) {
      setMovimientoForm(movimiento);
      setEditando(true);
    } else {
      setMovimientoForm({
        tipo_movimiento: "Entrada",
        producto: "",
        cantidad: "",
        empleado: "",
      });
      setEditando(false);
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(false);
  };

  const guardarMovimiento = () => {
    if (
      !movimientoForm.producto ||
      !movimientoForm.cantidad ||
      !movimientoForm.empleado
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (editando) {
      setMovimientos(
        movimientos.map((m) =>
          m.id_movimiento === movimientoForm.id_movimiento ? movimientoForm : m
        )
      );
    } else {
      setMovimientos([
        ...movimientos,
        {
          ...movimientoForm,
          id_movimiento: movimientos.length + 1,
          fecha_movimiento: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    cerrarModal();
  };

  const eliminarMovimiento = (id_movimiento) => {
    if (window.confirm("¿Seguro que deseas eliminar este movimiento?")) {
      setMovimientos(
        movimientos.filter((m) => m.id_movimiento !== id_movimiento)
      );
    }
  };

  const movimientosFiltrados = movimientos.filter((m) =>
    m.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="movimientos-page">
      <Sidebar /> {/* ✅ Sidebar importado */}

      <div className="contenedor-movimientos">
        {/* 📌 Encabezado */}
        <div className="header-container">
          <h2>📦 Registro de Movimientos</h2>
          <button className="btn-agregar" onClick={() => abrirModal()}>
            <FaPlus /> Agregar Movimiento
          </button>
        </div>

        {/* 📌 Barra de Búsqueda */}
        <div className="buscador">
          <FaSearch className="icono-busqueda" />
          <input
            type="text"
            placeholder="Buscar por producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 📌 Tabla de Movimientos */}
        <div className="tabla-container">
          <table className="movimientos-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Empleado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.map((mov) => (
                <tr key={mov.id_movimiento}>
                  <td>{mov.tipo_movimiento}</td>
                  <td>{mov.producto}</td>
                  <td>{mov.cantidad}</td>
                  <td>{mov.empleado}</td>
                  <td>{mov.fecha_movimiento}</td>
                  <td className="acciones">
                    <button className="btn-editar" onClick={() => abrirModal(mov)}>
                      <FaEdit />
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarMovimiento(mov.id_movimiento)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📌 Modal de Formulario */}
        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>{editando ? "Editar Movimiento" : "Nuevo Movimiento"}</h3>
              <label>Tipo de Movimiento:</label>
              <select
                value={movimientoForm.tipo_movimiento}
                onChange={(e) =>
                  setMovimientoForm({ ...movimientoForm, tipo_movimiento: e.target.value })
                }
              >
                <option value="Entrada">Entrada</option>
                <option value="Salida">Salida</option>
              </select>
              <label>Producto:</label>
              <input
                type="text"
                value={movimientoForm.producto}
                onChange={(e) =>
                  setMovimientoForm({ ...movimientoForm, producto: e.target.value })
                }
              />
              <label>Cantidad:</label>
              <input
                type="number"
                value={movimientoForm.cantidad}
                onChange={(e) =>
                  setMovimientoForm({ ...movimientoForm, cantidad: e.target.value })
                }
              />
              <label>Empleado:</label>
              <input
                type="text"
                value={movimientoForm.empleado}
                onChange={(e) =>
                  setMovimientoForm({ ...movimientoForm, empleado: e.target.value })
                }
              />
              <button className="btn-guardar" onClick={guardarMovimiento}>
                Guardar
              </button>
              <button className="btn-cerrar" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movimientos;
