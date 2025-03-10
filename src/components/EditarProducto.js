import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaEdit, FaTrash } from "react-icons/fa";
import "../styles.css";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    sucursal: "",
    cantidad: "",
    precio: "",
  });

  useEffect(() => {
    const datosProducto = {
      id: 111540,
      nombre: "ACTUALIZACION EQUIPOS POSVENTA",
      sucursal: "Mantenimiento y Garantías",
      cantidad: 10,
      precio: 500,
    };

    if (parseInt(id) === datosProducto.id) {
      setProducto(datosProducto);
    }
  }, [id]);

  const handleEditar = () => {
    console.log("Producto editado:", producto);
    navigate("/almacenes"); // Redirige a Almacenes después de la edición
  };

  const handleEliminar = () => {
    console.log("Producto eliminado:", producto.id);
    navigate("/almacenes"); // Redirige tras eliminar
  };

  return (
    <div className="almacenes-page">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo-container">
          <img
            src="/images/logo.png"
            alt="Logo Comics Store"
            className="logo"
          />
          <h2 className="sidebar-title">Comics Store</h2>
        </div>

        <ul className="sidebar-menu">
          <li className="menu-item" onClick={() => navigate("/inicioempleado")}>
            <FaBoxOpen className="icon" />{" "}
            <span className="menu-text">Inicio</span>
          </li>
        </ul>

        <div className="user-profile">
          <span className="user-name">Juan Pérez</span>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="main-content">
        <div className="almacen-header">
          <div className="almacen-title">
            <FaBoxOpen className="header-icon" />
            <h2>Editar Producto</h2>
          </div>
        </div>

        {/* Tabla con los datos del producto */}
        <div className="almacen-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Sucursal</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{id}</td>
                <td>
                  <input
                    type="text"
                    name="nombre"
                    value={producto.nombre}
                    onChange={(e) =>
                      setProducto({ ...producto, nombre: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="sucursal"
                    value={producto.sucursal}
                    onChange={(e) =>
                      setProducto({ ...producto, sucursal: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="cantidad"
                    value={producto.cantidad}
                    onChange={(e) =>
                      setProducto({ ...producto, cantidad: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="precio"
                    value={producto.precio}
                    onChange={(e) =>
                      setProducto({ ...producto, precio: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button className="btn-edit" onClick={handleEditar}>
                    <FaEdit /> Editar
                  </button>
                  <button className="btn-delete" onClick={handleEliminar}>
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default EditarProducto;
