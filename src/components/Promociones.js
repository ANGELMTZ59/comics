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
        const resProductos = await axios.get(
          "http://localhost:5000/api/productos"
        );
        const resPromociones = await axios.get(
          "http://localhost:5000/api/promociones"
        );
        setProductos(resProductos.data.productos);
        setPromociones(resPromociones.data.promociones);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
      }
    };
    fetchData();
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

  const guardarPromocion = async () => {
    if (
      !promocionForm.id_producto ||
      !promocionForm.descripcion ||
      !promocionForm.descuento
    ) {
      alert("Completa todos los campos");
      return;
    }

    try {
      if (editingPromocion) {
        // Si estamos editando, hacer PUT
        const response = await axios.put(
          `http://localhost:5000/api/promociones/${editingPromocion.id_promocion}`,
          promocionForm
        );
        if (response.data.success) {
          alert("✅ Promoción actualizada correctamente");
        }
      } else {
        // Si estamos agregando, hacer POST
        const response = await axios.post(
          "http://localhost:5000/api/promociones",
          promocionForm
        );
        if (response.data.success) {
          alert("✅ Promoción agregada correctamente");
        }
      }

      setModalVisible(false);
      // Refrescar las promociones después de agregar o editar
      const resPromociones = await axios.get(
        "http://localhost:5000/api/promociones"
      );
      setPromociones(resPromociones.data.promociones);
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
        const response = await axios.delete(
          `http://localhost:5000/api/promociones/${id}`
        );

        if (response.data.success) {
          alert("✅ Promoción eliminada correctamente");
          // Refrescar las promociones
          const resPromociones = await axios.get(
            "http://localhost:5000/api/promociones"
          );
          setPromociones(resPromociones.data.promociones);
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
                  (p.producto &&
                    p.producto
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())) ||
                  (p.descripcion &&
                    p.descripcion
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()))
              )
              .map((p, index) => (
                <tr key={p.id_promocion}>
                  <td>{index + 1}</td>
                  <td>{p.producto}</td>
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
            {/* Cambiar título dependiendo si estamos en modo editar o ver */}
            <h3>{editingPromocion ? "Editar Promoción" : "Ver Promoción"}</h3>

            {/* Producto */}
            <label>Producto:</label>
            <select
              value={promocionForm.id_producto}
              onChange={(e) => {
                if (editingPromocion) {
                  setPromocionForm({
                    ...promocionForm,
                    id_producto: e.target.value,
                  });
                }
              }}
              disabled={!editingPromocion} // Solo habilitar en modo editar
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
              onChange={(e) => {
                if (editingPromocion) {
                  setPromocionForm({
                    ...promocionForm,
                    descripcion: e.target.value,
                  });
                }
              }}
              disabled={!editingPromocion} // Solo habilitar en modo editar
            />

            {/* Descuento */}
            <label>Descuento (%):</label>
            <input
              type="number"
              value={promocionForm.descuento}
              onChange={(e) => {
                if (editingPromocion) {
                  setPromocionForm({
                    ...promocionForm,
                    descuento: e.target.value,
                  });
                }
              }}
              disabled={!editingPromocion} // Solo habilitar en modo editar
            />

            {/* Fecha de Inicio */}
            <label>Fecha de Inicio:</label>
            <input
              type="date"
              value={promocionForm.fecha_inicio}
              onChange={(e) => {
                if (editingPromocion) {
                  setPromocionForm({
                    ...promocionForm,
                    fecha_inicio: e.target.value,
                  });
                }
              }}
              disabled={!editingPromocion} // Solo habilitar en modo editar
            />

            {/* Fecha de Fin */}
            <label>Fecha de Fin:</label>
            <input
              type="date"
              value={promocionForm.fecha_fin}
              onChange={(e) => {
                if (editingPromocion) {
                  setPromocionForm({
                    ...promocionForm,
                    fecha_fin: e.target.value,
                  });
                }
              }}
              disabled={!editingPromocion} // Solo habilitar en modo editar
            />

            {/* Estado */}
            <label>Estado:</label>
            <select
              value={promocionForm.estado}
              onChange={(e) => {
                if (editingPromocion) {
                  setPromocionForm({
                    ...promocionForm,
                    estado: e.target.value,
                  });
                }
              }}
              disabled={!editingPromocion} // Solo habilitar en modo editar
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>

            <div className="modal-buttons">
              {/* Solo mostrar el botón de guardar en modo de edición */}
              {editingPromocion && (
                <button className="btn-guardar" onClick={guardarPromocion}>
                  Guardar
                </button>
              )}
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
