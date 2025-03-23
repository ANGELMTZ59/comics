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

app.get("/api/empleado", (req, res) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({ success: false, message: "No autorizado" });

  let decoded;
  try {
    decoded = jwt.verify(token.split(" ")[1], SECRET_KEY); // ✅ Verifica el token
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }

  const id_usuario = decoded.id;

  const sql = `
    SELECT id_usuario, email, id_rol, nombre AS nombre_usuario, 
       puesto, telefono, fecha_contratacion
FROM usuarios
WHERE id_usuario = ?

  `;

  db.query(sql, [id_usuario], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error en la BD" });

    if (result.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Empleado no encontrado" });

    res.json({ success: true, empleado: result[0] });
  });
});

app.get("/api/puestos", (req, res) => {
  const sql = "SELECT id_rol, nombre_rol FROM roles";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener los puestos:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    }
    res.json({ success: true, puestos: results });
  });
});

// ✅ Inicio de sesión con validación de contraseña
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Faltan datos" });

  const sql = `
    SELECT id_usuario, email, contraseña, activo, nombre, puesto
    FROM usuarios
    WHERE email = ?
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
          nombre: usuario.nombre,
          puesto: usuario.puesto,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ success: true, token, usuario });
    } catch (error) {
      console.error("❌ Error al verificar contraseña:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al verificar la contraseña",
      });
    }
  });
});

app.put("/api/empleado/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, email, telefono, puesto } = req.body;

  if (!id_usuario || !nombre || !email || !telefono || !puesto) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos requeridos" });
  }

  const sql = `
    UPDATE usuarios
    SET nombre = ?, email = ?, telefono = ?, puesto = ?
    WHERE id_usuario = ?
  `;

  db.query(
    sql,
    [nombre, email, telefono, puesto, id_usuario],
    (err, result) => {
      if (err) {
        console.error("❌ Error actualizando usuario:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error en la base de datos" });
      }

      res.json({
        success: true,
        message: "Usuario actualizado correctamente",
      });
    }
  );
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

// ✅ Ruta para editar cliente existente
app.put("/api/clientes/:id", (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    email,
    telefono,
    direccion,
    nivel_membresia,
    frecuencia_compra,
  } = req.body;

  if (!nombre || !email || !telefono || !direccion) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  const sql = `UPDATE clientes 
               SET nombre = ?, email = ?, telefono = ?, direccion = ?, nivel_membresia = ?, frecuencia_compra = ? 
               WHERE id_cliente = ?`;

  db.query(
    sql,
    [
      nombre,
      email,
      telefono,
      direccion,
      nivel_membresia,
      frecuencia_compra,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar cliente:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error en la BD" });
      }

      res.json({ success: true, message: "Cliente actualizado correctamente" });
    }
  );
});

// ✅ Eliminar cliente
app.delete("/api/clientes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM clientes WHERE id_cliente = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar cliente:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la BD" });
    }

    res.json({ success: true, message: "Cliente eliminado correctamente" });
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
      c.id_cliente, 
      c.nombre AS nombre_cliente,  
      c.email, 
      c.telefono, 
      c.direccion, 
      c.fecha_registro,
      c.nivel_membresia,
      c.frecuencia_compra,
      m.id_membresia,
      COALESCE(m.nivel, 'Sin membresía') AS nivel_membresia,
      m.fecha_inicio,
      m.fecha_fin,
      COALESCE(m.beneficios, 'Sin beneficios') AS beneficios
    FROM clientes c
    LEFT JOIN membresias m ON c.id_cliente = m.id_cliente
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener clientes con membresías:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    res.json(results);
  });
});

// ✅ Agregar una nueva membresía (evita duplicados)
app.post("/api/membresias", (req, res) => {
  const { id_cliente, nivel, fecha_inicio, fecha_fin, beneficios } = req.body;

  if (!id_cliente || !nivel || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  const sql = `INSERT INTO membresias (id_cliente, nivel, fecha_inicio, fecha_fin, beneficios) 
               VALUES (?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [id_cliente, nivel, fecha_inicio, fecha_fin, beneficios],
    (err, result) => {
      if (err) {
        console.error("❌ Error al agregar membresía:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error en la BD" });
      }

      // ✅ Actualizar cliente también
      const sqlCliente = `
        UPDATE clientes SET nivel_membresia = ? WHERE id_cliente = ?
      `;
      db.query(sqlCliente, [nivel, id_cliente], (errUpdate) => {
        if (errUpdate) {
          return res.status(500).json({
            success: false,
            message: "Membresía creada pero error al actualizar cliente",
          });
        }

        res.json({
          success: true,
          message: "Membresía y cliente actualizados correctamente",
        });
      });
    }
  );
});

// ✅ Editar una membresía existente
app.put("/api/membresias/:id", (req, res) => {
  const { id } = req.params;
  const { id_cliente, nivel, fecha_inicio, fecha_fin, beneficios } = req.body;

  const sqlMembresia = `
    UPDATE membresias 
    SET id_cliente = ?, nivel = ?, fecha_inicio = ?, fecha_fin = ?, beneficios = ?
    WHERE id_membresia = ?
  `;

  db.query(
    sqlMembresia,
    [id_cliente, nivel, fecha_inicio, fecha_fin, beneficios, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar membresía:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }

      // 🔁 También actualiza el nivel de membresía en la tabla de clientes
      const sqlCliente = `
        UPDATE clientes
        SET nivel_membresia = ?
        WHERE id_cliente = ?
      `;
      db.query(sqlCliente, [nivel, id_cliente], (errCliente) => {
        if (errCliente) {
          console.error("❌ Error al actualizar cliente:", errCliente);
          return res.status(500).json({ error: "Error al actualizar cliente" });
        }

        res.json({
          success: true,
          message: "Membresía y cliente actualizados correctamente",
        });
      });
    }
  );
});

app.delete("/api/membresias/:id", (req, res) => {
  const { id } = req.params;

  // Primero obtenemos el id_cliente relacionado
  const sqlGetCliente = `SELECT id_cliente FROM membresias WHERE id_membresia = ?`;

  db.query(sqlGetCliente, [id], (err, result) => {
    if (err || result.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener cliente" });
    }

    const id_cliente = result[0].id_cliente;

    // Eliminar la membresía
    const sqlDelete = `DELETE FROM membresias WHERE id_membresia = ?`;
    db.query(sqlDelete, [id], (errDelete) => {
      if (errDelete) {
        return res
          .status(500)
          .json({ success: false, message: "Error al eliminar membresía" });
      }

      // ❗ También actualizar nivel_membresia del cliente a "Sin membresía"
      const sqlUpdateCliente = `
        UPDATE clientes SET nivel_membresia = 'Sin membresía' WHERE id_cliente = ?
      `;
      db.query(sqlUpdateCliente, [id_cliente], (errUpdate) => {
        if (errUpdate) {
          return res.status(500).json({
            success: false,
            message: "Error al actualizar cliente",
          });
        }

        res.json({
          success: true,
          message: "Membresía eliminada y cliente actualizado",
        });
      });
    });
  });
});

/* ------------------------------------- */
/* 🔹 INICIAR SERVIDOR                  */
/* ------------------------------------- */
const PORT = 5000;
app.listen(PORT, () => console.log(`🔥 Servidor en http://localhost:${PORT}`));
