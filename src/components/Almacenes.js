import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaCog,
  FaFilter,
  FaEllipsisV,
  FaEdit,
  FaSearch,
  FaHashtag,
  FaDollarSign,
  FaTrash,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaHome
} from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Se importa el Sidebar
import "../promociones.css";

const Almacenes = () => {
  const navigate = useNavigate();
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");

  const [productos, setProductos] = useState([
    {
      id: 111540,
      nombre: "ACTUALIZACION EQUIPOS POSVENTA",
      sucursal: "Mantenimiento y Garantías",
      cantidad: 10,
      precio: 500,
    },
    {
      id: 110616,
      nombre: "ADMINISTRACIÓN",
      sucursal: "CEDIS",
      cantidad: 5,
      precio: 800,
    },
  ]);

  const handleEditar = (id) => {
    navigate(`/editar-producto/${id}`);
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const toggleOpciones = () => {
    setMostrarOpciones(!mostrarOpciones);
  };

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  return (
    <div className="almacenes-page">
      <Sidebar /> {/* ✅ Se muestra el sidebar importado */}

      {/* Contenido principal de Almacenes */}
      <main className="main-content">
        <div className="almacen-header">
          <div className="almacen-title">
            <FaBoxOpen className="header-icon" />
            <h2>Almacén</h2>
          </div>

          {/* Botones alineados a la derecha en la misma fila */}
          <div className="almacen-actions">
            <button className="btn btn-green" onClick={toggleFormulario}>
              <FaPlus /> Agregar
            </button>
            {/* Botón "Más opciones" con submenú */}
            <div className="menu-opciones-container">
              <button className="btn btn-gray" onClick={toggleOpciones}>
                <FaEllipsisV /> Más opciones
              </button>

              {mostrarOpciones && (
                <div className="submenu-opciones">
                  <button
                    className="btn-opcion"
                    onClick={() => handleEditar(111540)}
                  >
                    <FaEdit /> Editar
                  </button>
                </div>
              )}
            </div>
            <button className="btn btn-filter" onClick={toggleFiltros}>
              <FaFilter /> Filtros
            </button>
          </div>
        </div>

        {/* Filtros desplegables en la misma página */}
        {mostrarFiltros && (
          <div className="filtro-container">
            <table className="filtro-table">
              <thead>
                <tr>
                  <th>
                    <FaHashtag /> Número
                  </th>
                  <th>
                    <FaSearch /> Nombre
                  </th>
                  <th>
                    <FaDollarSign /> Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Folio"
                      value={filtroNumero}
                      onChange={(e) => setFiltroNumero(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={filtroNombre}
                      onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Precio"
                      value={filtroPrecio}
                      onChange={(e) => setFiltroPrecio(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tabla de almacenes con los resultados filtrados */}
        <div className="almacen-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Sucursal</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.sucursal}</td>
                  <td>{producto.cantidad}</td>
                  <td>${producto.precio}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(`/editar-producto/${producto.id}`)
                      }
                    >
                      <FaEdit /> Editar
                    </button>
                    <button className="btn-delete">
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>📦 Registrar Producto</h3>
              <form>
                <div className="form-group">
                  <label>
                    <FaBoxOpen /> Nombre del Producto:
                  </label>
                  <input type="text" placeholder="Ingrese el nombre" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaHome /> Sucursal:
                    </label>
                    <input type="text" placeholder="Ingrese la sucursal" />
                  </div>

                  <div className="form-group">
                    <label>
                      <FaBoxOpen /> Cantidad:
                    </label>
                    <input type="number" placeholder="Ingrese la cantidad" />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <FaFileInvoiceDollar /> Precio:
                  </label>
                  <input type="number" placeholder="Ingrese el precio" />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-save">
                    ✅ Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={toggleFormulario}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Almacenes;
