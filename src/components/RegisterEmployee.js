// src/components/RegisterEmployee.js
import React, { useState } from 'react';
import axios from 'axios';
import "../styles.css";// Importar el archivo CSS

const RegisterEmployee = () => {
  const [employee, setEmployee] = useState({
    nombre: '',
    puesto: '',
    email: '',
    telefono: '',
    fecha_contratacion: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee.nombre || !employee.puesto || !employee.email || !employee.fecha_contratacion) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/employees', employee); // Cambiar la URL de la API
      setSuccess('Empleado registrado con éxito');
      setEmployee({
        nombre: '',
        puesto: '',
        email: '',
        telefono: '',
        fecha_contratacion: ''
      });
      setError('');
    } catch (err) {
      setError('Hubo un error al registrar el empleado');
    }
  };

  return (
      <div className="container">
      {/* Mostrar el logo como una imagen */}
      <img src="/images/logo.png" alt="Comics Planet Logo" className="logo"/>

      <h1>Registrar Empleado</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <i className="fa fa-user"></i>
          <input 
            type="text" 
            name="nombre" 
            value={employee.nombre} 
            onChange={handleChange} 
            placeholder="Nombre" 
            required 
          />
        </div>

        <div className="input-container">
          <i className="fa fa-briefcase"></i>
          <select 
            name="puesto" 
            value={employee.puesto} 
            onChange={handleChange} 
            required
          >
            <option value="">Seleccione el puesto</option>
            <option value="vendedor">Vendedor</option>
            <option value="vendedor ventas en linea">Vendedor Ventas en Línea</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <div className="input-container">
          <i className="fa fa-envelope"></i>
          <input 
            type="email" 
            name="email" 
            value={employee.email} 
            onChange={handleChange} 
            placeholder="Email" 
            required 
          />
        </div>

        <div className="input-container">
          <i className="fa fa-phone"></i>
          <input 
            type="text" 
            name="telefono" 
            value={employee.telefono} 
            onChange={handleChange} 
            placeholder="Teléfono" 
          />
        </div>

        <div className="input-container">
          <i className="fa fa-calendar"></i>
          <input 
            type="date" 
            name="fecha_contratacion" 
            value={employee.fecha_contratacion} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit">Registrar Empleado</button>
      </form>
    </div>
  );
};

export default RegisterEmployee;
