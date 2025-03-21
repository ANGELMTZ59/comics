import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { login } from "../services/api";
import "../styles.css"; // Asegúrate de que el archivo esté correctamente nombrado e importado.

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.token) {
      localStorage.setItem("token", response.token);
      window.location.href = "/inicioempleado"; // Redirige al dashboard
    } else {
      setError(response.error || "Credenciales incorrectas");
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
