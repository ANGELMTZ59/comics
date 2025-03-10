import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTags, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../promociones.css";
import Sidebar from "./sidebar";

const Promociones = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [promocionForm, setPromocionForm] = useState({
    id_producto: "",
    descripcion: "",
    descuento: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "activa",
  });
  const [editingPromocion, setEditingPromocion] = useState(null);

  useEffect(() => {
    setProductos([
      { id_producto: 1, nombre: "Laptop Dell" },
      { id_producto: 2, nombre: "Mouse Gamer" },
    ]);
    setPromociones([
      {
        id_promocion: 1,
        producto: "Laptop Dell",
        descripcion: "Descuento especial de primavera",
        descuento: "15%",
        fecha_inicio: "2025-03-10",
        fecha_fin: "2025-03-20",
        estado: "activa",
      },
      {
        id_promocion: 2,
        producto: "Mouse Gamer",
        descripcion: "Oferta relámpago",
        descuento: "10%",
        fecha_inicio: "2025-03-08",
        fecha_fin: "2025-03-15",
        estado: "inactiva",
      },
    ]);
  }, []);

  const abrirModal = (promocion = null) => {
    setEditingPromocion(promocion);
    setPromocionForm(
      promocion || {
        id_producto: "",
        descripcion: "",
        descuento: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "activa",
      }
    );
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const guardarPromocion = () => {
    if (!promocionForm.id_producto || !promocionForm.descripcion || !promocionForm.descuento) {
      alert("Completa todos los campos");
      return;
    }
    const productoSeleccionado = productos.find(
      (p) => p.id_producto.toString() === promocionForm.id_producto
    );
    const nuevaPromocion = {
      id_promocion: promociones.length + 1,
      producto: productoSeleccionado ? productoSeleccionado.nombre : "Desconocido",
      ...promocionForm,
    };
    setPromociones((prev) => [...prev, nuevaPromocion]);
    cerrarModal();
  };

  return (
    <div className="promociones-container">
      <Sidebar />

      <div className="encabezado">
        <h2>
          <FaTags /> Gestión de Promociones
        </h2>
        <button className="btn-agregar" onClick={() => abrirModal()}>
          <FaPlus /> Agregar Promoción
        </button>
      </div>

      <div className="buscador">
        <FaSearch className="icono-busqueda" />
        <input
          type="text"
          placeholder="Buscar por producto o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="promociones-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Descuento</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {promociones &&
            promociones.length > 0 &&
            promociones
              .filter(
                (p) =>
                  (p.producto && p.producto.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((p, index) => (
                <tr key={p.id_promocion}>
                  <td>{index + 1}</td>
                  <td>{p.producto}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.descuento}</td>
                  <td>{p.fecha_inicio}</td>
                  <td>{p.fecha_fin}</td>
                  <td>{p.estado}</td>
                  <td className="acciones">
                    <button className="btn-ver">
                      <FaEye />
                    </button>
                    <button className="btn-editar" onClick={() => abrirModal(p)}>
                      <FaEdit />
                    </button>
                    <button className="btn-eliminar">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingPromocion ? "Editar Promoción" : "Nueva Promoción"}</h3>
            <label>Producto:</label>
            <select
              value={promocionForm.id_producto}
              onChange={(e) =>
                setPromocionForm({
                  ...promocionForm,
                  id_producto: e.target.value,
                })
              }
            >
              <option value="">Seleccione un Producto</option>
              {productos.map((p) => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <label>Descripción:</label>
            <input
              type="text"
              value={promocionForm.descripcion}
              onChange={(e) =>
                setPromocionForm({
                  ...promocionForm,
                  descripcion: e.target.value,
                })
              }
            />
            <label>Descuento (%):</label>
            <input
              type="number"
              value={promocionForm.descuento}
              onChange={(e) =>
                setPromocionForm({
                  ...promocionForm,
                  descuento: e.target.value,
                })
              }
            />
            <label>Fecha de Inicio:</label>
            <input
              type="date"
              value={promocionForm.fecha_inicio}
              onChange={(e) =>
                setPromocionForm({
                  ...promocionForm,
                  fecha_inicio: e.target.value,
                })
              }
            />
            <label>Fecha de Fin:</label>
            <input
              type="date"
              value={promocionForm.fecha_fin}
              onChange={(e) =>
                setPromocionForm({
                  ...promocionForm,
                  fecha_fin: e.target.value,
                })
              }
            />
            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarPromocion}>
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

export default Promociones;
