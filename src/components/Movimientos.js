import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Se importa el Sidebar
import axios from "axios"; // Asegúrate de importar axios para hacer las peticiones
import "../styles.css";

const API_URL = "http://localhost:5000/api"; // Cambia esto si es necesario

const Movimientos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [movimientoForm, setMovimientoForm] = useState({
    tipo_movimiento: "Entrada",
    producto: "",
    cantidad: "",
    empleado: "",
  });
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Estado para errores
  const [productos, setProductos] = useState([]); // Lista de productos
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const res = await axios.get(`${API_URL}/movimientos`);
        console.log("Movimientos obtenidos:", res.data.movimientos); // Log para verificar datos
        if (res.data.success) {
          setMovimientos(res.data.movimientos);
        } else {
          setError("Error al cargar los movimientos.");
        }
      } catch (err) {
        console.error("Error al obtener los movimientos:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchMovimientos();
  }, []);

  useEffect(() => {
    // Fetch productos
    const fetchProductos = async () => {
      try {
        const res = await axios.get(`${API_URL}/productos`);
        setProductos(res.data.productos);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };

    // Fetch usuarios
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(`${API_URL}/usuarios`);
        setUsuarios(res.data.usuarios);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };

    fetchProductos();
    fetchUsuarios();
  }, []);

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

  const guardarMovimiento = async () => {
    if (
      !movimientoForm.producto ||
      !movimientoForm.cantidad ||
      !movimientoForm.empleado
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const payload = {
        tipo_movimiento: movimientoForm.tipo_movimiento,
        id_producto: movimientoForm.producto,
        cantidad: movimientoForm.cantidad,
        fecha_movimiento: formatDate(new Date()),
        id_usuario: movimientoForm.empleado,
      };

      const res = editando
        ? await axios.put(
            `${API_URL}/movimientos/${movimientoForm.id_movimiento}`,
            payload
          )
        : await axios.post(`${API_URL}/movimientos`, payload);

      if (res.data.success) {
        alert("Movimiento guardado correctamente.");
      }

      // Refrescar lista de movimientos
      const movimientosRes = await axios.get(`${API_URL}/movimientos`);
      setMovimientos(movimientosRes.data.movimientos);
    } catch (error) {
      console.error("Error al guardar el movimiento", error);
      alert("Ocurrió un error al guardar el movimiento.");
    }

    cerrarModal();
  };

  const eliminarMovimiento = async (id_movimiento) => {
    if (window.confirm("¿Seguro que deseas eliminar este movimiento?")) {
      try {
        await axios.delete(`${API_URL}/movimientos/${id_movimiento}`);
        const res = await axios.get(`${API_URL}/movimientos`);
        setMovimientos(res.data.movimientos);
      } catch (error) {
        console.error("Error al eliminar el movimiento", error);
      }
    }
  };

  const movimientosFiltrados = movimientos.filter(
    (m) =>
      m.producto && m.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Cargando movimientos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
                  <td>{mov.tipo_movimiento || "N/A"}</td>
                  <td>{mov.producto || "N/A"}</td>
                  <td>{mov.cantidad || "N/A"}</td>
                  <td>{mov.empleado || "N/A"}</td>
                  <td>{mov.fecha_movimiento?.substring(0, 10) || "N/A"}</td>
                  <td className="acciones">
                    <button
                      className="btn-editar"
                      onClick={() => abrirModal(mov)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarMovimiento(mov.id_movimiento)}
                    >
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
                  setMovimientoForm({
                    ...movimientoForm,
                    tipo_movimiento: e.target.value,
                  })
                }
              >
                <option value="Entrada">Entrada</option>
                <option value="Salida">Salida</option>
              </select>
              <label>Producto:</label>
              <select
                value={movimientoForm.producto}
                onChange={(e) =>
                  setMovimientoForm({
                    ...movimientoForm,
                    producto: e.target.value,
                  })
                }
              >
                <option value="">Selecciona un producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.id_producto}
                    value={producto.id_producto}
                  >
                    {producto.nombre}
                  </option>
                ))}
              </select>
              <label>Cantidad:</label>
              <input
                type="number"
                value={movimientoForm.cantidad}
                onChange={(e) =>
                  setMovimientoForm({
                    ...movimientoForm,
                    cantidad: e.target.value,
                  })
                }
              />
              <label>Empleado:</label>
              <select
                value={movimientoForm.empleado}
                onChange={(e) =>
                  setMovimientoForm({
                    ...movimientoForm,
                    empleado: e.target.value,
                  })
                }
              >
                <option value="">Selecciona un empleado</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
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
