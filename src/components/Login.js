import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css"; // Asegúrate de que el archivo esté correctamente nombrado e importado.

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("empleado", JSON.stringify(response.data.usuario));
        window.location.href = "/inicioempleado";
      } else {
        alert("❌ Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" className="logo" />
      </div>

      <div className="login-card">
        <h2>Bienvenido</h2>
        <p>Ingrese correo y contraseña.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          {" "}
          {/* Asegúrate de que aquí llame a handleLogin */}
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
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
