import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../clientes.css";

const API_URL = "http://localhost:5000/api";

const ClientesProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [carrito, setCarrito] = useState([]); // Estado para el carrito
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(() => {
    const storedCliente = localStorage.getItem("cliente");
    return storedCliente ? JSON.parse(storedCliente) : null;
  });

  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem("token");
      const cliente = localStorage.getItem("cliente");

      if (!token || !cliente) {
        alert("Por favor, inicie sesión para acceder a esta página.");
        navigate("/iniciar-sesion"); // Redirigir a la página de inicio de sesión
        return;
      }

      try {
        const parsedCliente = JSON.parse(cliente);
        console.log("👤 Cliente cargado:", parsedCliente);
      } catch (error) {
        console.error("❌ Error al analizar los datos del cliente:", error);
        localStorage.removeItem("cliente");
        alert(
          "Hubo un problema con su sesión. Por favor, inicie sesión nuevamente."
        );
        navigate("/iniciar-sesion");
      }
    };

    verificarSesion();
  }, [navigate]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await axios.get(`${API_URL}/productos`);
        if (response.data.success) {
          setProductos(response.data.productos);
        } else {
          console.error(
            "❌ Error al obtener productos:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  const handleVerDetalles = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleComprar = async () => {
    if (!productoSeleccionado) return;

    try {
      alert("✅ Compra realizada con éxito.");
      setProductoSeleccionado(null);
    } catch (error) {
      console.error("❌ Error al realizar la compra:", error);
      alert("Ocurrió un error al realizar la compra.");
    }
  };

  const handleAgregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id_producto === producto.id_producto
      );
      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  const handleVerCarrito = () => {
    navigate("/carrito", { state: { carrito } });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCrearUsuario = () => {
    navigate("/crear-usuario");
  };

  const handleIniciarSesion = () => {
    navigate("/iniciar-sesion");
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cliente");
    navigate("/iniciar-sesion");
  };

  return (
    <div className="clientes-productos-page">
      <header className="header nav-flex">
        <div className="header-left">
          <img src="/images/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="header-center">
          <select className="category-select">
            <option value="all">Todas las categorías</option>
            <option value="comics">Comics</option>
            <option value="figuras">Figuras</option>
          </select>
          <input
            type="text"
            placeholder="Buscar en Comics Planet..."
            className="search-bar"
          />
          <button className="search-button">🔍</button>
        </div>
        <div className="header-right">
          {cliente ? (
            <div
              className="nav-link"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <img
                src="/images/avatar.png" // Ruta del avatar del cliente
                alt="Avatar"
                className="avatar"
              />
              {showDropdown && (
                <div className="dropdown logout-dropdown">
                  <p>Hola, {cliente.nombre}</p>
                  <button
                    className="btn-cerrar-sesion"
                    onClick={handleCerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="nav-link"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              Hola, identifícate
              <br />
              <strong>Cuenta y Listas</strong>
              {showDropdown && (
                <div className="dropdown">
                  <button
                    className="btn-identificarse"
                    onClick={handleCrearUsuario}
                  >
                    Identificarse
                  </button>
                  <p>
                    ¿Ya tienes una cuenta?{" "}
                    <a href="#" onClick={handleIniciarSesion}>
                      Inicia sesión aquí.
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
          <a href="#" className="nav-link">
            Devoluciones
            <br />
            <strong>y Pedidos</strong>
          </a>
          <a href="#" className="nav-link cart" onClick={handleVerCarrito}>
            🛒
            <span className="cart-count">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          </a>
        </div>
      </header>

      <div className="brands-section">
        <h2>Marcas Populares</h2>
        <div className="brands-grid">
          <img src="/images/marvel-logo.png" alt="Marvel" />
          <img src="/images/dc-logo.png" alt="DC Comics" />
          <img src="/images/funko-logo.png" alt="Funko" />
          <img src="/images/starwars-logo.png" alt="Star Wars" />
          <img src="/images/hasbro-logo.png" alt="Hasbro" />
          <img src="/images/lego-logo.png" alt="LEGO" />
        </div>
      </div>

      <div className="featured-products-section">
        <h2>Productos Destacados</h2>
        <div className="productos-carousel">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="producto-card">
              <img
                src={producto.imagen || "/images/default-product.jpg"}
                alt={producto.nombre}
                className="producto-imagen"
              />
              <h3>{producto.nombre}</h3>
              <p>Precio: ${(Number(producto.precio) || 0).toFixed(2)}</p>
              <div className="producto-botones">
                <button onClick={() => handleVerDetalles(producto)}>
                  Ver Detalle
                </button>
                <button onClick={() => handleAgregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
                <button onClick={() => handleComprar(producto)}>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="special-offers-section">
        <h2>Ofertas Espectaculares</h2>
        <div className="productos-carousel">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="producto-card">
              <img
                src={producto.imagen || "/images/default-product.jpg"}
                alt={producto.nombre}
                className="producto-imagen"
              />
              <h3>{producto.nombre}</h3>
              <p>Precio: ${(Number(producto.precio) || 0).toFixed(2)}</p>
              <div className="producto-botones">
                <button onClick={() => handleVerDetalles(producto)}>
                  Ver Detalle
                </button>
                <button onClick={() => handleAgregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
                <button onClick={() => handleComprar(producto)}>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="exclusive-products-section">
        <h2>Exclusivos de Comics Planet</h2>
        <div className="productos-carousel">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="producto-card">
              <img
                src={producto.imagen || "/images/default-product.jpg"}
                alt={producto.nombre}
                className="producto-imagen"
              />
              <h3>{producto.nombre}</h3>
              <p>Precio: ${(Number(producto.precio) || 0).toFixed(2)}</p>
              <div className="producto-botones">
                <button onClick={() => handleVerDetalles(producto)}>
                  Ver Detalle
                </button>
                <button onClick={() => handleAgregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
                <button onClick={() => handleComprar(producto)}>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="popular-products-section">
        <h2>Populares</h2>
        <div className="productos-carousel">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="producto-card">
              <img
                src={producto.imagen || "/images/default-product.jpg"}
                alt={producto.nombre}
                className="producto-imagen"
              />
              <h3>{producto.nombre}</h3>
              <p>Precio: ${(Number(producto.precio) || 0).toFixed(2)}</p>
              <div className="producto-botones">
                <button onClick={() => handleVerDetalles(producto)}>
                  Ver Detalle
                </button>
                <button onClick={() => handleAgregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
                <button onClick={() => handleComprar(producto)}>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="new-releases-section">
        <h2>Estrenos</h2>
        <div className="productos-carousel">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="producto-card">
              <img
                src={producto.imagen || "/images/default-product.jpg"}
                alt={producto.nombre}
                className="producto-imagen"
              />
              <h3>{producto.nombre}</h3>
              <p>Precio: ${(Number(producto.precio) || 0).toFixed(2)}</p>
              <div className="producto-botones">
                <button onClick={() => handleVerDetalles(producto)}>
                  Ver Detalle
                </button>
                <button onClick={() => handleAgregarAlCarrito(producto)}>
                  Agregar al carrito
                </button>
                <button onClick={() => handleComprar(producto)}>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre}</td>
                <td>${(Number(producto.precio) || 0).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleVerDetalles(producto)}>
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img
              src={
                productoSeleccionado.imagen_url || "/images/default-product.jpg"
              }
              alt={productoSeleccionado.nombre}
              className="producto-imagen-detalle"
            />
            <h2>{productoSeleccionado.nombre}</h2>
            <p>
              <strong>Descripción:</strong> {productoSeleccionado.descripcion}
            </p>
            <p>
              <strong>Marca:</strong> {productoSeleccionado.editorial_o_marca}
            </p>
            <p>
              <strong>Categoría:</strong> {productoSeleccionado.categoria}
            </p>
            <p>
              <strong>Precio:</strong> $
              {(Number(productoSeleccionado.precio) || 0).toFixed(2)}
            </p>
            <button
              onClick={() => handleAgregarAlCarrito(productoSeleccionado)}
            >
              Agregar al carrito
            </button>
            <button onClick={() => setProductoSeleccionado(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Conócenos</h4>
            <ul>
              <li>Sobre Comics Planet</li>
              <li>Trabaja con nosotros</li>
              <li>Prensa</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Gana dinero con nosotros</h4>
            <ul>
              <li>Vende tus productos</li>
              <li>Afíliate</li>
              <li>Promociona tus productos</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Podemos ayudarte</h4>
            <ul>
              <li>Devoluciones</li>
              <li>Ayuda</li>
              <li>Gestión de pedidos</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Métodos de pago</h4>
            <ul>
              <li>Tarjetas de crédito y débito</li>
              <li>Pago en efectivo</li>
              <li>Pago a meses</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <button className="scroll-to-top" onClick={scrollToTop}>
            Inicio de página
          </button>
          <p>© 2023 Comics Planet. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ClientesProductos;
