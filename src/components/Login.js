import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import "../styles.css"; // Asegúrate de que el archivo esté correctamente nombrado e importado.

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Verificar que los campos no estén vacíos antes de enviar la solicitud
      if (!email || !password) {
        alert("Por favor, complete todos los campos.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        if (response.data.usuario) {
          try {
            localStorage.setItem(
              "empleado",
              JSON.stringify(response.data.usuario)
            );
            window.location.href = "/inicioempleado";
          } catch (parseError) {
            console.error(
              "❌ Error al guardar el empleado en localStorage:",
              parseError
            );
            alert("Error al procesar los datos del empleado.");
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

      // Mostrar un mensaje de error más claro al usuario
      if (error.response && error.response.status === 400) {
        alert("Usuario o contraseña incorrectos. Por favor, intente de nuevo.");
      } else {
        alert("Error al iniciar sesión. Por favor, intente más tarde.");
      }
    }
  };

  // Validar y analizar los datos de "empleado" desde localStorage
  const storedDataKey = "empleado";
  const storedData = localStorage.getItem(storedDataKey);
  let parsedData = null;

  if (storedData) {
    try {
      parsedData = JSON.parse(storedData);
    } catch (error) {
      console.error(
        `❌ Error al analizar los datos de ${storedDataKey}:`,
        error
      );
      localStorage.removeItem(storedDataKey); // Limpiar datos inválidos
    }
  }

  // Mostrar un mensaje claro solo si no hay datos válidos y no se ha mostrado antes
  if (!parsedData && !localStorage.getItem("empleado_warning_shown")) {
    console.warn(
      `⚠️ No se encontraron datos válidos para la clave: ${storedDataKey}`
    );
    localStorage.setItem("empleado_warning_shown", "true"); // Evitar mensajes repetitivos
  }

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" className="logo" />
      </div>

      <div className="login-card">
        <h2>Bienvenido Empleado</h2>
        <p>Ingrese correo y contraseña.</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Iniciar Sesión Empleado
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
