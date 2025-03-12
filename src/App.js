import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterEmployee from "./components/RegisterEmployee";
import InicioEmpleado from "./components/InicioEmpleado";
import Almacenes from "./components/Almacenes";
import RecepcionMercancia from "./components/RecepcionMercancia";
import EditarProducto from "./components/EditarProducto";
import GestionProveedores from "./components/GestionProveedores";
import AgregarProveedor from "./components/AgregarProveedor";
import GestionEmpleados from "./components/GestionEmpleados";
import Movimientos from "./components/Movimientos";
import OrdenesCompra from "./components/OrdenesCompra";
import Clientes from "./components/Clientes";
import Membresias from "./components/Membresias";
import Notificaciones from "./components/Notificaciones";
import Promociones from "./components/Promociones";
import Login from "./components/Login";

function App() {
  const [empleado, setEmpleado] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Redirección automática de "/" a "/inicioempleado" */}
        <Route path="/" element={<Navigate to="/Login" />} />

        <Route path="/register-employee" element={<RegisterEmployee />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/inicioempleado"
          element={<InicioEmpleado setEmpleado={setEmpleado} />}
        />
        <Route path="/almacenes" element={<Almacenes />} />
        <Route
          path="/recepcion-de-mercancia"
          element={<RecepcionMercancia />}
        />
        <Route path="/editar-producto/:id" element={<EditarProducto />} />
        <Route path="/gestion-proveedores" element={<GestionProveedores />} />
        <Route path="/agregar-proveedor" element={<AgregarProveedor />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/ordenes-de-compra" element={<OrdenesCompra />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/membresias" element={<Membresias />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route
          path="/gestion-empleados"
          element={
            empleado?.rol === "Administrador" ? (
              <GestionEmpleados empleado={empleado} />
            ) : (
              <Navigate to="/inicioempleado" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
