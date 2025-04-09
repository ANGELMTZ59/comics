import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTags,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../promociones.css";
import Sidebar from "./sidebar";

// Define la base URL de FastAPI
const API_URL = "https://fastapi-my17.onrender.com/api";

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
    const fetchData = async () => {
      try {
        const resProductos = await axios.get(`${API_URL}/productos`);
        const resPromociones = await axios.get(`${API_URL}/promociones`);
        setProductos(resProductos.data.productos || resProductos.data);
        setPromociones(resPromociones.data.promociones || resPromociones.data);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  const abrirModal = (promocion = null) => {
    setEditingPromocion(promocion); // Guarda la promoción completa si se está editando, o null si es nueva
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

  const guardarPromocion = async () => {
    if (
      !promocionForm.id_producto ||
      !promocionForm.descripcion ||
      !promocionForm.descuento ||
      !promocionForm.fecha_inicio ||
      !promocionForm.fecha_fin
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      if (editingPromocion) {
        // Editar promoción
        const response = await axios.put(
          `${API_URL}/promociones/${editingPromocion.id_promocion}`,
          promocionForm
        );
        if (response.data.success) {
          alert("✅ Promoción actualizada correctamente");
        }
      } else {
        // Agregar promoción
        const response = await axios.post(
          `${API_URL}/promociones`,
          promocionForm
        );
        if (response.data.success) {
          alert("✅ Promoción agregada correctamente");
        }
      }
      setModalVisible(false);
      const resPromociones = await axios.get(`${API_URL}/promociones`);
      setPromociones(resPromociones.data.promociones || resPromociones.data);
    } catch (error) {
      console.error("❌ Error al guardar promoción:", error);
      alert("Error al guardar la promoción.");
    }
  };

  const verPromocion = (promocion) => {
    setPromocionForm(promocion); // Asignamos los datos de la promoción
    setEditingPromocion(false); // No estamos en modo de edición
    setModalVisible(true); // Abrimos el modal en modo solo lectura
  };

  const eliminarPromocion = async (id) => {
    console.log("ID de la promoción a eliminar:", id); // Verifica el ID

    if (window.confirm("¿Seguro que deseas eliminar esta promoción?")) {
      try {
        const response = await axios.delete(`${API_URL}/promociones/${id}`);

        if (response.data.success) {
          alert("✅ Promoción eliminada correctamente");
          const resPromociones = await axios.get(`${API_URL}/promociones`);
          setPromociones(
            resPromociones.data.promociones || resPromociones.data
          );
        }
      } catch (error) {
        console.error("❌ Error al eliminar la promoción:", error);
        alert("Error al eliminar la promoción.");
      }
    }
  };

  return (
    <div className="promociones-container">
      <Sidebar />

      <div className="encabezado">
        <h2>
          <FaTags /> Gestión de Promociones
        </h2>
        {/* Botón de agregar promoción */}
        <button
          className="btn-agregar"
          onClick={() => abrirModal()} // Abre el modal para agregar una nueva promoción
        >
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
                  (p.producto &&
                    p.producto
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())) || // Corrige el acceso al campo producto
                  (p.descripcion &&
                    p.descripcion
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()))
              )
              .map((p, index) => (
                <tr key={p.id_promocion}>
                  <td>{index + 1}</td>
                  <td>{p.producto}</td> {/* Muestra el nombre del producto */}
                  <td>{p.descripcion}</td>
                  <td>{p.descuento}</td>
                  <td>{new Date(p.fecha_inicio).toLocaleDateString()}</td>
                  <td>{new Date(p.fecha_fin).toLocaleDateString()}</td>
                  <td>{p.estado}</td>
                  <td className="acciones">
                    <button
                      className="btn-editar"
                      onClick={() => abrirModal(p)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarPromocion(p.id_promocion)}
                    >
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
            <h3>
              {editingPromocion ? "Editar Promoción" : "Agregar Promoción"}
            </h3>{" "}
            {/* Cambia el título */}
            {/* Producto */}
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
            {/* Descripción */}
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
            {/* Descuento */}
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
            {/* Fecha de Inicio */}
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
            {/* Fecha de Fin */}
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
            {/* Estado */}
            <label>Estado:</label>
            <select
              value={promocionForm.estado}
              onChange={(e) =>
                setPromocionForm({
                  ...promocionForm,
                  estado: e.target.value,
                })
              }
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
            <div className="modal-buttons">
              {/* Botón de guardar/agregar */}
              <button className="btn-guardar" onClick={guardarPromocion}>
                {editingPromocion ? "Guardar Cambios" : "Agregar"}
              </button>
              {/* Botón de cerrar */}
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
