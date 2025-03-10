import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilter,
  FaSearch,
  FaPlus,
  FaTruck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Sidebar from "./sidebar"; // ✅ Importamos el sidebar
import "../mercancia.css";

const RecepcionMercancia = () => {
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaRecepcion, setNuevaRecepcion] = useState({
    numero: "",
    proveedor: "",
    almacen: "",
    fechaRecepcion: "",
    fechaDocumento: "",
    numDocumento: "",
    tipoProducto: "",
    cantidad: "",
    marca: "",
    estatus: "",
    total: "",
  });

  const handleChange = (e) => {
    setNuevaRecepcion({ ...nuevaRecepcion, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    console.log("Nueva Recepción:", nuevaRecepcion);
    setMostrarFormulario(false);
  };

  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [productos, setProductos] = useState([
    {
      numero: "1001",
      proveedor: "Marvel Comics",
      almacen: "Bodega Norte",
      fechaRecepcion: "2025-03-01",
      fechaDocumento: "2025-02-28",
      numDocumento: "DOC-789",
      tipoProducto: "Comics",
      cantidad: 50,
      marca: "Marvel",
      estatus: "Recibido",
      total: "$1,200",
    },
    {
      numero: "1002",
      proveedor: "Hasbro",
      almacen: "Bodega Sur",
      fechaRecepcion: "2025-03-02",
      fechaDocumento: "2025-02-27",
      numDocumento: "DOC-790",
      tipoProducto: "Muñecos de Acción",
      cantidad: 30,
      marca: "Hasbro",
      estatus: "Pendiente",
      total: "$900",
    },
  ]);

  return (
    <div className="recepcion-page">
      <Sidebar /> {/* ✅ Sidebar importado */}

      {/* Formulario emergente (modal) */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Agregar Recepción de Mercancía</h3>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="numero"
                placeholder="Número"
                onChange={handleChange}
              />
              <input
                type="text"
                name="proveedor"
                placeholder="Proveedor"
                onChange={handleChange}
              />
              <input
                type="text"
                name="almacen"
                placeholder="Almacén"
                onChange={handleChange}
              />
              <input type="date" name="fechaRecepcion" onChange={handleChange} />
              <input type="date" name="fechaDocumento" onChange={handleChange} />
              <input
                type="text"
                name="numDocumento"
                placeholder="Número de Documento"
                onChange={handleChange}
              />
              <select name="tipoProducto" onChange={handleChange}>
                <option value="">Seleccionar tipo</option>
                <option value="Comics">Comics</option>
                <option value="Figuras">Figuras</option>
              </select>
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                onChange={handleChange}
              />
              <input type="text" name="marca" placeholder="Marca" onChange={handleChange} />
              <select name="estatus" onChange={handleChange}>
                <option value="">Seleccionar estatus</option>
                <option value="Recibido">Recibido</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <input type="text" name="total" placeholder="Total" onChange={handleChange} />
            </div>
            <div className="modal-footer">
              <button className="btn-guardar" onClick={handleGuardar}>
                <FaPlus /> Guardar
              </button>
              <button className="btn-cerrar" onClick={() => setMostrarFormulario(false)}>
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="main-content">
        <div className="almacen-header">
          <div className="header-title">
            <FaTruck className="header-icon" />
            <h2>Recepciones de Mercancía</h2>
          </div>
          <div className="header-actions">
            <button className="btn-agregar" onClick={() => setMostrarFormulario(true)}>
              <FaPlus /> Agregar
            </button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="filtro-container">
          <div className="filtro-header" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
            <div className="filtro-title">
              <FaFilter className="filtro-icon" />
              <h3>Filtros</h3>
              <span className="filtro-arrow">
                {mostrarFiltros ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>

          {mostrarFiltros && (
            <>
              <div className="filtro-content">
                <input type="date" name="fechaCreacion" placeholder="Fecha de Creación" />
                <input type="text" name="numeroDocumento" placeholder="Número de Documento" />
                <input type="text" name="palabraClave" placeholder="Palabra Clave (Comics, Muñecos, etc.)" />
                <select name="tipoProducto">
                  <option value="">Seleccionar tipo</option>
                  <option value="Comics">Comics</option>
                  <option value="Figuras">Figuras</option>
                  <option value="Posters">Posters</option>
                </select>
                <select name="estatus">
                  <option value="">Seleccionar estatus</option>
                  <option value="Recibido">Recibido</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En camino">En camino</option>
                </select>
                <input type="text" name="proveedor" placeholder="Proveedor" />
                <input type="text" name="almacen" placeholder="Almacén" />
              </div>

              <div className="filtro-actions">
                <button className="btn-buscar">
                  <FaSearch /> Buscar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Tabla de Recepción */}
        <div className="almacen-table">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Proveedor</th>
                <th>Almacén</th>
                <th>Fecha de Recepción</th>
                <th>Fecha de Documento</th>
                <th>Núm. Documento</th>
                <th>Tipo Producto</th>
                <th>Cantidad</th>
                <th>Marca</th>
                <th>Estatus</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.numero}</td>
                  <td>{producto.proveedor}</td>
                  <td>{producto.almacen}</td>
                  <td>{producto.fechaRecepcion}</td>
                  <td>{producto.fechaDocumento}</td>
                  <td>{producto.numDocumento}</td>
                  <td>{producto.tipoProducto}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.marca}</td>
                  <td>{producto.estatus}</td>
                  <td>{producto.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RecepcionMercancia;
