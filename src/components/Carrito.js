import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Carrito = () => {
  const { state } = useLocation();
  const carrito = state?.carrito || [];
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acc, item) => acc + item.cantidad * (Number(item.precio) || 0),
    0
  );

  const handleEliminarProducto = (id_producto) => {
    // Implementar lógica para eliminar un producto del carrito
  };

  const handleProcederPago = () => {
    alert("Procediendo al pago...");
  };

  const handleVolver = () => {
    navigate("/productos");
  };

  return (
    <div className="carrito-page">
      <header className="header nav-flex">
        <div className="header-left">
          <img src="/images/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="header-center">
          <h1>Carrito de Compras</h1>
        </div>
        <div className="header-right">
          <button className="btn-volver" onClick={handleVolver}>
            Volver a Productos
          </button>
        </div>
      </header>

      <div className="carrito-contenido">
        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <p>No hay productos en el carrito.</p>
            <button className="btn-volver" onClick={handleVolver}>
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="carrito-grid">
            <div className="carrito-productos">
              {carrito.map((item) => (
                <div key={item.id_producto} className="carrito-item">
                  <img
                    src={item.imagen || "/images/default-product.jpg"}
                    alt={item.nombre}
                    className="carrito-imagen"
                  />
                  <div className="carrito-detalles">
                    <h3>{item.nombre}</h3>
                    <p>
                      <strong>Precio unitario:</strong> $
                      {(Number(item.precio) || 0).toFixed(2)}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {item.cantidad}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> $
                      {(item.cantidad * (Number(item.precio) || 0)).toFixed(2)}
                    </p>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminarProducto(item.id_producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="carrito-resumen">
              <h3>Resumen del Pedido</h3>
              <p>
                <strong>Subtotal:</strong> ${total.toFixed(2)}
              </p>
              <p>
                <strong>Fecha estimada de entrega:</strong>{" "}
                {new Date().toLocaleDateString()}
              </p>
              <button className="btn-pago" onClick={handleProcederPago}>
                Proceder al Pago
              </button>
            </div>
          </div>
        )}
      </div>

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
          <p>© 2023 Comics Planet. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Carrito;
