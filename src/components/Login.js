import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles.css"; // Asegúrate de que el archivo esté correctamente nombrado e importado.

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de datos de usuario permitidos (esto luego se reemplaza por la base de datos)
    const fakeUser = {
      email: "admin@example.com",
      password: "123456",
    };

    // Validación de credenciales
    if (email === fakeUser.email && password === fakeUser.password) {
      alert("Inicio de sesión exitoso");
      setError(""); // Borrar error si existe
      localStorage.setItem("isAuthenticated", "true"); // Guardar estado de autenticación
      window.location.href = "/inicioempleado"; // Redireccionar
    } else {
      setError("Correo o contraseña incorrectos.");
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

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
