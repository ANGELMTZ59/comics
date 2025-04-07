import React, { useState } from "react";
import axios from "axios"; // Importar axios
import "../clientes.css";

const IniciarSesion = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/client-login",
        {
          email: formData.correo,
          password: formData.contrasena,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        if (response.data.usuario) {
          try {
            localStorage.setItem(
              "cliente",
              JSON.stringify(response.data.usuario)
            );
            window.location.href = "/productos"; // Redirigir a ClientesProductos
          } catch (parseError) {
            console.error(
              "❌ Error al guardar el cliente en localStorage:",
              parseError
            );
            alert("Error al procesar los datos del cliente.");
          }
        } else {
          console.error("❌ Usuario no definido en la respuesta del servidor.");
          alert("Error: Usuario no definido.");
        }
      } else {
        alert("❌ Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="iniciar-sesion-page">
      <div className="form-wrapper">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-submit">
            Iniciar Sesión
          </button>
          <p>
            ¿Eres un cliente nuevo?{" "}
            <a href="/crear-usuario">Crea tu cuenta aquí.</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
