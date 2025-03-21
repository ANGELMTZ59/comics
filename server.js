// 📌 Importación de módulos necesarios
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Clave para JWT (se recomienda usar un archivo .env)
const SECRET_KEY = "tu_secreto";

// 📌 Configurar conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Master12$",
  database: "comicstore",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err);
  } else {
    console.log("🔥 Conectado a MySQL");
  }
});

/* ------------------------------------- */
/* 🔹 1. AUTENTICACIÓN (LOGIN & TOKEN)  */
/* ------------------------------------- */

// ✅ Inicio de sesión con validación de contraseña
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Faltan datos" });

  const sql = `
    SELECT u.id_usuario, u.email, u.contraseña, u.activo, 
           e.id_empleado, e.nombre, e.puesto
    FROM Usuarios u
    LEFT JOIN Empleados e ON u.id_empleado = e.id_empleado
    WHERE u.email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    if (results.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Usuario no encontrado" });

    const usuario = results[0];
    if (usuario.activo !== "si")
      return res
        .status(403)
        .json({ success: false, message: "Cuenta inactiva" });

    try {
      const validPassword = await bcrypt.compare(password, usuario.contraseña);
      if (!validPassword)
        return res
          .status(401)
          .json({ success: false, message: "Contraseña incorrecta" });

      const token = jwt.sign(
        {
          id: usuario.id_usuario,
          email: usuario.email,
          id_empleado: usuario.id_empleado,
          nombre: usuario.nombre,
          puesto: usuario.puesto,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ success: true, token, usuario });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error interno al verificar la contraseña",
      });
    }
  });
});

/* ------------------------------------- */
/* 🔹 2. GESTIÓN DE CLIENTES            */
/* ------------------------------------- */

// ✅ Obtener todos los clientes
app.get("/api/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error en la BD" });
    res.json({ success: true, clientes: result });
  });
});

// ✅ Crear un nuevo cliente
app.post("/api/clientes", (req, res) => {
  const {
    nombre,
    email,
    telefono,
    direccion,
    nivel_membresia,
    frecuencia_compra,
  } = req.body;
  if (!nombre || !email || !telefono || !direccion)
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });

  const sql = `INSERT INTO clientes (nombre, email, telefono, direccion, nivel_membresia, frecuencia_compra, fecha_registro)
               VALUES (?, ?, ?, ?, ?, ?, NOW())`;

  db.query(
    sql,
    [nombre, email, telefono, direccion, nivel_membresia, frecuencia_compra],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error en la BD" });

      res.json({ success: true, message: "Cliente agregado correctamente" });
    }
  );
});

/* ------------------------------------- */
/* 🔹 3. GESTIÓN DE MEMBRESÍAS          */
/* ------------------------------------- */

app.get("/api/membresias", (req, res) => {
  const sql = `
    SELECT m.id_membresia, m.id_cliente, c.nombre AS nombre_cliente, c.email, 
           m.nivel, m.fecha_inicio, m.fecha_fin, m.beneficios
    FROM membresias m
    JOIN clientes c ON m.id_cliente = c.id_cliente;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener membresías:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (!results.length) {
      console.warn("⚠ No hay membresías registradas.");
    }

    console.log("📋 Datos obtenidos desde la BD:", results);
    res.json(results);
  });
});

// ✅ Obtener todas las membresías con clientes
app.get("/api/clientes_membresias", (req, res) => {
  const sql = `
    SELECT 
      m.id_membresia,  -- 🟢 Asegura que este campo se incluya
      c.id_cliente, 
      c.nombre AS nombre_cliente,  
      c.email, 
      c.telefono, 
      c.direccion, 
      c.fecha_registro, 
      COALESCE(m.nivel, 'Sin membresía') AS nivel_membresia,
      COALESCE(m.fecha_inicio, NULL) AS fecha_inicio,
      COALESCE(m.fecha_fin, NULL) AS fecha_fin,
      COALESCE(m.beneficios, 'Sin beneficios') AS beneficios
    FROM clientes c
    LEFT JOIN membresias m ON c.id_cliente = m.id_cliente;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener clientes con membresías:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    console.log("📋 Datos obtenidos desde la BD:", results);
    res.json(results);
  });
});

// ✅ Agregar una nueva membresía (evita duplicados)
app.post("/api/membresias", (req, res) => {
  const { id_cliente, nivel, fecha_inicio, fecha_fin, beneficios } = req.body;

  if (!id_cliente || !nivel || !fecha_inicio || !fecha_fin)
    return res.status(400).json({ success: false, message: "Faltan datos" });

  // Verificar si el cliente ya tiene una membresía
  db.query(
    "SELECT id_membresia FROM membresias WHERE id_cliente = ?",
    [id_cliente],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error en la BD" });

      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El cliente ya tiene una membresía",
        });
      }

      // Si no existe, se inserta la nueva membresía
      const sql = `INSERT INTO membresias (id_cliente, nivel, fecha_inicio, fecha_fin, beneficios) VALUES (?, ?, ?, ?, ?)`;

      db.query(
        sql,
        [id_cliente, nivel, fecha_inicio, fecha_fin, beneficios],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: "Error en la BD" });

          res.json({
            success: true,
            message: "Membresía agregada correctamente",
          });
        }
      );
    }
  );
});

// ✅ Editar una membresía existente
app.put("/api/membresias/:id", (req, res) => {
  const { id } = req.params;
  const { id_cliente, nivel, fecha_inicio, fecha_fin, beneficios } = req.body;

  if (!id || !id_cliente || !nivel || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  const sql = `
      UPDATE membresias 
      SET id_cliente = ?, nivel = ?, fecha_inicio = ?, fecha_fin = ?, beneficios = ?
      WHERE id_membresia = ?
  `;

  db.query(
    sql,
    [id_cliente, nivel, fecha_inicio, fecha_fin, beneficios, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar membresía:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      res.json({
        success: true,
        message: "Membresía actualizada correctamente",
      });
    }
  );
});

/* ------------------------------------- */
/* 🔹 INICIAR SERVIDOR                  */
/* ------------------------------------- */
const PORT = 5000;
app.listen(PORT, () => console.log(`🔥 Servidor en http://localhost:${PORT}`));
