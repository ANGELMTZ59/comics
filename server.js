// 📌 Importación de módulos necesarios
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Cargar variables de entorno desde un archivo .env
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Clave para JWT (usar variable de entorno o un valor predeterminado)
const SECRET_KEY = process.env.JWT_SECRET || "tu_secreto"; // Asegúrate de que JWT_SECRET esté definido en el archivo .env

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
  if (!token) {
    return res.status(401).json({ success: false, message: "No autorizado" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }

  const id_usuario = decoded.id_usuario; // Asegúrate de que el token contiene `id_usuario`

  const sql = `
    SELECT u.id_usuario, u.email, u.id_rol, u.nombre AS nombre_usuario, 
           u.telefono, u.fecha_contratacion,
           r.nombre_rol AS puesto
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = ?
  `;

  db.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.error("❌ Error al consultar el empleado:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Empleado no encontrado" });
    }

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

  // Validar que los campos requeridos estén presentes
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email y contraseña son requeridos." });
  }

  const sql = `
    SELECT id_usuario, nombre, email, contraseña, activo, id_rol
    FROM usuarios
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Error al consultar el usuario:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const usuario = results[0];

    if (usuario.activo === "no") {
      return res.status(403).json({
        success: false,
        message: "Usuario desactivado. No puede iniciar sesión.",
      });
    }

    const match = await bcrypt.compare(password, usuario.contraseña);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        id_rol: usuario.id_rol,
      },
    });
  });
});

app.post("/api/login/empleado", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id_usuario, nombre, email, contraseña, activo, id_rol
    FROM usuarios
    WHERE email = ? AND id_rol = 2 -- Asegúrate de que el rol 2 sea para empleados
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Error al consultar el usuario:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const usuario = results[0];

    if (usuario.activo === "no") {
      return res.status(403).json({
        success: false,
        message: "Usuario desactivado. No puede iniciar sesión.",
      });
    }

    const match = await bcrypt.compare(password, usuario.contraseña);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ success: true, token, usuario });
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

// ✅ Inicio de sesión para clientes
app.post("/api/client-login", (req, res) => {
  const { email, password } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email y contraseña son requeridos." });
  }

  const sql = `
    SELECT id_cliente, nombre, email, contraseña
    FROM clientes
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Error al consultar el cliente:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cliente no encontrado" });
    }

    const cliente = results[0];

    const match = await bcrypt.compare(password, cliente.contraseña);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id_cliente: cliente.id_cliente }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      usuario: {
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        email: cliente.email,
      },
    });
  });
});

/* ------------------------------------- */
/* 🔹 2. GESTIÓN DE CLIENTES            */
/* ------------------------------------- */

// ✅ Obtener todos los clientes
app.get("/api/clientes", (req, res) => {
  const sql = `
    SELECT 
      id_cliente, 
      nombre, 
      email, 
      telefono, 
      direccion, 
      fecha_registro, 
      nivel_membresia, 
      frecuencia_compra 
    FROM clientes
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener clientes:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    }
    res.json({ success: true, clientes: results });
  });
});

app.put("/api/clientes/:id", (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    email,
    telefono,
    direccion,
    nivel_membresia,
    frecuencia_compra,
    fecha_registro,
  } = req.body;

  // Verificación de campos obligatorios
  if (!nombre || !email || !telefono || !direccion || !fecha_registro) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  // Formatear la fecha correctamente
  const fechaFormateada = new Date(fecha_registro)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const sql = `
    UPDATE clientes SET
      nombre = ?, email = ?, telefono = ?, direccion = ?, nivel_membresia = ?,
      frecuencia_compra = ?, fecha_registro = ?
    WHERE id_cliente = ?
  `;

  db.query(
    sql,
    [
      nombre,
      email,
      telefono,
      direccion,
      nivel_membresia,
      frecuencia_compra,
      fechaFormateada,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar cliente:", err);
        return res.status(500).json({
          success: false,
          message: "Error en la base de datos",
          error: err,
        });
      }

      if (result.affectedRows > 0) {
        return res.json({
          success: true,
          message: "Cliente actualizado correctamente",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Cliente no encontrado" });
      }
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

app.post("/api/clientes", (req, res) => {
  const {
    nombre,
    email,
    telefono,
    direccion,
    fecha_registro,
    nivel_membresia = "regular",
    frecuencia_compra = "baja",
  } = req.body;

  // Asegúrate de que los datos se reciban correctamente
  console.log("Datos recibidos para insertar cliente:", req.body);

  // Validación de campos
  if (!nombre || !email || !telefono || !direccion || !fecha_registro) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  // Formatear la fecha para MySQL (asegurando el formato 'YYYY-MM-DD HH:mm:ss')
  const fechaFormateada = new Date(fecha_registro)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const sql = `
    INSERT INTO clientes 
    (nombre, email, telefono, direccion, nivel_membresia, frecuencia_compra, fecha_registro)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nombre,
      email,
      telefono,
      direccion,
      nivel_membresia,
      frecuencia_compra,
      fechaFormateada,
    ],
    (err, result) => {
      if (err) {
        // Log del error detallado para depuración
        console.error("❌ Error al insertar cliente:", err);
        return res.status(500).json({
          success: false,
          message: "Error en la base de datos",
          error: err,
        });
      }

      const id = result.insertId;
      db.query(
        "SELECT * FROM clientes WHERE id_cliente = ?",
        [id],
        (err2, clienteResult) => {
          if (err2) {
            return res.status(500).json({
              success: false,
              message: "Error al obtener cliente insertado",
              error: err2,
            });
          }
          res.json({
            success: true,
            message: "Cliente agregado correctamente",
            cliente: clienteResult[0],
          });
        }
      );
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
/* 🔹 4. GESTIÓN DE NOTIFICACIONES       */
/* ------------------------------------- */

app.get("/api/notificaciones", (req, res) => {
  const sql = `
    SELECT 
      n.id_notificacion,
      n.id_cliente,
      c.nombre AS nombre_cliente,
      n.id_promocion,
      p.descripcion AS promocion,
      n.titulo,
      n.mensaje,
      n.fecha_envio,
      n.leida
    FROM notificacionesclientes n
    LEFT JOIN clientes c ON n.id_cliente = c.id_cliente
    LEFT JOIN promociones p ON n.id_promocion = p.id_promocion
    ORDER BY n.fecha_envio DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener notificaciones:", err.message); // Log the error message
      console.error("📋 Consulta SQL ejecutada:", sql); // Log the SQL query for debugging
      return res.status(500).json({
        success: false,
        message: "Error en la base de datos",
        error: err.message,
      });
    }

    res.json({ success: true, notificaciones: results });
  });
});

app.post("/api/notificaciones", (req, res) => {
  const { id_cliente, id_promocion, titulo, mensaje, fecha_envio } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_cliente || !titulo || !mensaje || !fecha_envio) {
    console.error("❌ Faltan campos obligatorios:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Faltan campos obligatorios" });
  }

  const sql = `
    INSERT INTO notificacionesclientes (id_cliente, id_promocion, titulo, mensaje, fecha_envio, leida)
    VALUES (?, ?, ?, ?, ?, 'no')
  `;

  db.query(
    sql,
    [id_cliente, id_promocion || null, titulo, mensaje, fecha_envio],
    (err, result) => {
      if (err) {
        console.error("❌ Error al insertar notificación:", err);
        return res.status(500).json({
          success: false,
          message: "Error en la base de datos",
          error: err.message,
        });
      }

      const id = result.insertId;
      const sqlSelect = `
        SELECT 
          n.*, 
          c.nombre AS nombre_cliente, 
          p.descripcion AS promocion 
        FROM notificacionesclientes n
        LEFT JOIN clientes c ON n.id_cliente = c.id_cliente
        LEFT JOIN promociones p ON n.id_promocion = p.id_promocion
        WHERE n.id_notificacion = ?
      `;

      db.query(sqlSelect, [id], (err2, result2) => {
        if (err2) {
          console.error("❌ Error al obtener notificación insertada:", err2);
          return res.status(500).json({
            success: false,
            message: "Error al obtener notificación insertada",
          });
        }

        res.json({ success: true, notificacion: result2[0] });
      });
    }
  );
});

app.put("/api/notificaciones/:id/leida", (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE notificacionesclientes
    SET leida = 'si'
    WHERE id_notificacion = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al marcar como leída:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al actualizar" });
    }

    res.json({ success: true, message: "Notificación marcada como leída" });
  });
});

app.delete("/api/notificaciones/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM notificacionesclientes WHERE id_notificacion = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar notificación:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al eliminar" });
    }

    res.json({ success: true, message: "Notificación eliminada" });
  });
});

/* ------------------------------------- */
/* 🔹 Gestion Promociones                */

// 🔁 Obtener promociones
app.get("/api/promociones", (req, res) => {
  const sql = `
    SELECT 
      p.nombre AS producto, -- Incluye el nombre del producto
      pr.id_promocion,
      pr.descripcion,
      pr.descuento,
      pr.fecha_inicio,
      pr.fecha_fin,
      pr.estado
    FROM promociones pr
    LEFT JOIN productos p ON pr.id_producto = p.id_producto
    WHERE pr.estado = 'activa'
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener promociones:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    }
    res.json({ success: true, promociones: results });
  });
});

// ➕ Agregar nueva promoción
app.post("/api/promociones", (req, res) => {
  const {
    id_producto,
    descripcion,
    descuento,
    fecha_inicio,
    fecha_fin,
    estado,
  } = req.body;

  const sql = `
    INSERT INTO promociones (id_producto, descripcion, descuento, fecha_inicio, fecha_fin, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [id_producto, descripcion, descuento, fecha_inicio, fecha_fin, estado],
    (err, result) => {
      if (err) {
        console.error("❌ Error al insertar promoción:", err);
        return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, insertId: result.insertId });
    }
  );
});

// 🗑️ Eliminar promoción por ID
app.delete("/api/promociones/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM promociones WHERE id_promocion = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar promoción:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({
      success: true,
      message: "✅ Promoción eliminada correctamente",
    });
  });
});

// ✏️ Editar promoción existente
app.put("/api/promociones/:id", (req, res) => {
  const id = req.params.id;
  const {
    id_producto,
    descripcion,
    descuento,
    fecha_inicio,
    fecha_fin,
    estado,
  } = req.body;

  const sql = `
    UPDATE promociones 
    SET id_producto = ?, descripcion = ?, descuento = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
    WHERE id_promocion = ?
  `;

  db.query(
    sql,
    [id_producto, descripcion, descuento, fecha_inicio, fecha_fin, estado, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar promoción:", err);
        return res.status(500).json({ success: false, error: err });
      }
      res.json({
        success: true,
        message: "✅ Promoción actualizada correctamente",
      });
    }
  );
});

/* ------------------------------------- */
/* 🔹 GESTION PRODUCTOS                  */
/* ------------------------------------- */

app.get("/api/productos", (req, res) => {
  const sql = `
    SELECT 
      p.id_producto,
      p.nombre,
      p.descripcion,
      p.categoria,
      p.stock_actual,
      p.stock_minimo,
      p.precio,
      p.editorial_o_marca,
      p.fecha_lanzamiento,
      p.imagen_url,
      pr.nombre AS proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
    ORDER BY p.id_producto
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, productos: results });
  });
});

// Configurar CORS para que permita solicitudes de tu frontend en localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000", // Permitir solicitudes desde localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"], // Los métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Los encabezados permitidos
  })
);

// Agregar producto
const multer = require("multer");
const path = require("path");

// Configurar multer para guardar imágenes en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Guarda la imagen con un nombre único
  },
});

const upload = multer({ storage });

// Subir la imagen
// Obtener el siguiente número de documento automáticamente
app.post("/api/recepciones", (req, res) => {
  const {
    id_proveedor,
    almacen,
    fecha_recepcion,
    fecha_documento,
    tipo_producto,
    cantidad,
    marca,
    estatus,
    total,
  } = req.body;

  // Obtener el último número de documento
  const sql =
    "SELECT numero_documento FROM recepcionesmercancia ORDER BY id_recepcion DESC LIMIT 1";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener último número de documento:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener último número de documento.",
      });
    }

    let nuevoNumeroDocumento = "0001"; // Valor por defecto si no hay datos
    if (results.length > 0) {
      const ultimoNumero = results[0].numero_documento;
      const siguienteNumero = parseInt(ultimoNumero) + 1;
      nuevoNumeroDocumento = siguienteNumero.toString().padStart(4, "0"); // Generar el nuevo número de documento con ceros a la izquierda
    }

    // Ahora insertar la nueva recepción con el número generado automáticamente
    const sqlInsert = `
      INSERT INTO recepcionesmercancia
      (id_proveedor, almacen, fecha_recepcion, fecha_documento, numero_documento, tipo_producto, cantidad, marca, estatus, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valores = [
      id_proveedor,
      almacen,
      fecha_recepcion,
      fecha_documento || null,
      nuevoNumeroDocumento, // Usamos el número generado automáticamente
      tipo_producto,
      cantidad,
      marca,
      estatus,
      total,
    ];

    db.query(sqlInsert, valores, (err, result) => {
      if (err) {
        console.error("❌ Error al insertar recepción:", err);
        return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, insertId: result.insertId });
    });
  });
});

app.put("/api/productos/:id", (req, res) => {
  const id = req.params.id;
  const {
    nombre,
    descripcion,
    categoria,
    stock_actual,
    stock_minimo,
    precio,
    editorial_o_marca,
    fecha_lanzamiento,
    imagen_url,
    id_proveedor,
  } = req.body;

  const sql = `UPDATE productos SET
    nombre = ?, descripcion = ?, categoria = ?, stock_actual = ?, stock_minimo = ?, precio = ?, editorial_o_marca = ?, fecha_lanzamiento = ?, imagen_url = ?, id_proveedor = ?
    WHERE id_producto = ?`;

  db.query(
    sql,
    [
      nombre,
      descripcion,
      categoria,
      stock_actual,
      stock_minimo,
      precio,
      editorial_o_marca,
      fecha_lanzamiento,
      imagen_url,
      id_proveedor,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar producto:", err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

// Eliminar producto
app.delete("/api/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id_producto = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar producto:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

// POST: Restock a product
app.post("/api/productos/:id/restock", (req, res) => {
  const { id } = req.params;
  const { cantidad, id_usuario } = req.body;

  if (!cantidad || !id_usuario) {
    return res.status(400).json({
      success: false,
      message: "Cantidad e ID de usuario son obligatorios.",
    });
  }

  const sqlUpdateStock = `
    UPDATE productos 
    SET stock_actual = stock_actual + ? 
    WHERE id_producto = ?
  `;

  const sqlCheckStock = `
    SELECT stock_actual, stock_minimo, nombre 
    FROM productos 
    WHERE id_producto = ?
  `;

  db.query(sqlUpdateStock, [cantidad, id], (errUpdate) => {
    if (errUpdate) {
      console.error("❌ Error al actualizar stock:", errUpdate);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar stock.",
      });
    }

    // Verificar el nuevo nivel de stock
    db.query(sqlCheckStock, [id], (errCheck, stockResults) => {
      if (errCheck) {
        console.error("❌ Error al verificar stock:", errCheck);
        return res.status(500).json({
          success: false,
          message: "Error al verificar stock.",
        });
      }

      const { stock_actual, stock_minimo, nombre } = stockResults[0];
      if (stock_actual > stock_minimo) {
        return res.json({
          success: true,
          message: `El producto "${nombre}" ha sido reabastecido. Nivel actual: ${stock_actual}.`,
        });
      } else {
        return res.json({
          success: true,
          warning: true,
          message: `El producto "${nombre}" sigue por debajo del nivel mínimo (${stock_minimo}). Nivel actual: ${stock_actual}.`,
        });
      }
    });
  });
});

/* ------------------------------------- */
/* 🔹 GESTION PROVEEDORES                */
/* ------------------------------------- */

// 📦 Obtener todos los proveedores
app.get("/api/proveedores", (req, res) => {
  const sql = `SELECT * FROM proveedores ORDER BY id_proveedor`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener proveedores:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true, proveedores: results });
  });
});

// 📦 Crear un nuevo proveedor
// En el endpoint de agregar proveedor
app.post("/api/proveedores", (req, res) => {
  const { nombre, email, telefono, direccion, fecha_ultimo_abastecimiento } =
    req.body;

  const sql = `
    INSERT INTO proveedores (nombre, email, telefono, direccion, fecha_ultimo_abastecimiento)
    VALUES (?, ?, ?, ?, ?)
  `;

  const valores = [
    nombre,
    email,
    telefono,
    direccion,
    fecha_ultimo_abastecimiento || null, // Si no se proporciona fecha, se enviará null
  ];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error("❌ Error al insertar proveedor:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

// 📦 Editar un proveedor
app.put("/api/proveedores/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, direccion } = req.body;

  if (!nombre || !email || !telefono || !direccion) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos son obligatorios.",
    });
  }

  const sql = `
    UPDATE proveedores
    SET nombre = ?, email = ?, telefono = ?, direccion = ?
    WHERE id_proveedor = ?
  `;
  db.query(sql, [nombre, email, telefono, direccion, id], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar proveedor:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

// 📦 Eliminar un proveedor
app.delete("/api/proveedores/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM proveedores WHERE id_proveedor = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar proveedor:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

/* ------------------------------------- */
/* 🔹 GESTION ORDENES DE COMPRA          */
/* ------------------------------------- */

app.get("/api/ordenesproveedor", (req, res) => {
  const sql = `
    SELECT 
      o.id_orden,
      p.nombre AS producto,
      pr.nombre AS proveedor,
      o.cantidad,
      o.estado,
      o.fecha_orden,
      u.nombre AS usuario -- Incluye el nombre del usuario que solicitó la orden
    FROM ordenesproveedores o
    JOIN productos p ON o.id_producto = p.id_producto
    JOIN proveedores pr ON o.id_proveedor = pr.id_proveedor
    LEFT JOIN usuarios u ON o.id_usuario = u.id_usuario -- Relación con la tabla de usuarios
    ORDER BY o.id_orden DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener órdenes:", err);
      return res.status(500).json({ success: false, error: err });
    }
    console.log("Órdenes obtenidas:", results);
    res.json({ success: true, ordenes: results });
  });
});

app.post("/api/ordenesproveedor", (req, res) => {
  const {
    id_producto,
    cantidad,
    id_proveedor,
    fecha_orden, // La fecha que recibes del frontend
    estado,
  } = req.body;

  // Asegúrate de que la fecha esté correctamente formateada
  const fechaOrden = fecha_orden ? new Date(fecha_orden) : new Date(); // Si no envías la fecha, usa la fecha actual

  // Verifica que las fechas sean correctas
  if (isNaN(fechaOrden)) {
    return res
      .status(400)
      .json({ success: false, message: "Fecha de orden no válida" });
  }

  const fechaOrdenISO = fechaOrden.toISOString().slice(0, 19).replace("T", " "); // Formato adecuado para SQL

  const sql = `INSERT INTO ordenesproveedores (id_producto, cantidad, id_proveedor, fecha_orden, estado) VALUES (?, ?, ?, ?, ?)`;

  try {
    db.query(
      sql,
      [id_producto, cantidad, id_proveedor, fechaOrdenISO, estado],
      (err, result) => {
        if (err) {
          console.error("❌ Error al insertar la orden", err); // Asegúrate de ver el error aquí
          return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, id: result.insertId });
      }
    );
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

app.get("/api/ordenesproveedor/:id", (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM ordenesproveedores WHERE id_orden = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada" });
    }
    res.json({ success: true, orden: result[0] });
  });
});

app.put("/api/ordenesproveedor/:id", (req, res) => {
  // Maneja la lógica para actualizar una orden
  const { id } = req.params; // Extrae el ID de la orden desde la URL
  const { id_producto, cantidad, id_proveedor, estado } = req.body;

  const sql = `
    UPDATE ordenesproveedores
    SET id_producto = ?, cantidad = ?, id_proveedor = ?, estado = ?
    WHERE id_orden = ?
  `;

  db.query(
    sql,
    [id_producto, cantidad, id_proveedor, estado, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar la orden:", err);
        return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true });
    }
  );
});

app.delete("/api/ordenesproveedor/:id_orden", (req, res) => {
  const { id_orden } = req.params;

  const sql = `DELETE FROM ordenesproveedores WHERE id_orden = ?`;

  db.query(sql, [id_orden], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar orden:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

/* ------------------------------------- */
/* 🔹 GESTION RECEPCION DE MERCANCIA     */
/* ------------------------------------- */

// Obtener recepciones
app.get("/api/recepciones", (req, res) => {
  const {
    numeroDocumento,
    palabraClave,
    tipoProducto,
    estatus,
    proveedor,
    almacen,
  } = req.query;

  let sql = `
    SELECT r.id_recepcion,
    FROM recepcionesmercancia r
    JOIN proveedores pr ON r.id_proveedor = pr.id_proveedor
    WHERE 1=1
  `;

  if (numeroDocumento)
    sql += ` AND r.numero_documento LIKE '%${numeroDocumento}%'`;
  if (palabraClave) sql += ` AND r.marca LIKE '%${palabraClave}%'`;
  if (tipoProducto) sql += ` AND r.tipo_producto = '${tipoProducto}'`;
  if (estatus) sql += ` AND r.estatus = '${estatus}'`;
  if (proveedor) sql += ` AND pr.nombre LIKE '%${proveedor}%'`;
  if (almacen) sql += ` AND r.almacen LIKE '%${almacen}%'`;

  sql += " ORDER BY r.id_recepcion DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta SQL:", err); // Log the SQL error
      return res.status(500).json({
        success: false,
        message: "Error en la consulta SQL.",
        error: err.message,
      });
    }

    console.log("📋 Datos obtenidos desde la BD:", results); // Log the fetched data
    res.json({ success: true, recepciones: results });
  });
});

// Agregar una recepción
// Obtener el último número de documento y número de recepción
app.post("/api/recepciones", (req, res) => {
  const {
    id_proveedor,
    almacen,
    fecha_recepcion,
    fecha_documento,
    tipo_producto,
    cantidad,
    marca,
    estatus,
    total,
  } = req.body;

  // Generar número de documento automáticamente
  db.query(
    "SELECT MAX(numero_documento) AS max_doc FROM recepcionesmercancia",
    (err, results) => {
      if (err) {
        console.error(
          "❌ Error al obtener el último número de documento:",
          err
        );
        return res.status(500).json({ success: false, error: err });
      }
      const nuevoNumeroDocumento = results[0].max_doc
        ? parseInt(results[0].max_doc) + 1
        : 1;

      // Generar número de recepción
      db.query(
        "SELECT MAX(numero) AS max_recepcion FROM recepcionesmercancia",
        (err2, results2) => {
          if (err2) {
            console.error(
              "❌ Error al obtener el último número de recepción:",
              err2
            );
            return res.status(500).json({ success: false, error: err2 });
          }
          const nuevoNumeroRecepcion = results2[0].max_recepcion
            ? parseInt(results2[0].max_recepcion) + 1
            : 1;

          const sql = `
            INSERT INTO recepcionesmercancia 
            (id_proveedor, almacen, fecha_recepcion, fecha_documento, numero_documento, tipo_producto, cantidad, marca, estatus, total, numero)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const valores = [
            id_proveedor,
            almacen,
            fecha_recepcion,
            fecha_documento || null,
            nuevoNumeroDocumento, // Utilizamos el nuevo número de documento generado
            tipo_producto,
            cantidad,
            marca,
            estatus,
            total,
            nuevoNumeroRecepcion, // Utilizamos el nuevo número de recepción generado
          ];

          db.query(sql, valores, (err3, result) => {
            if (err3) {
              console.error("❌ Error al insertar recepción:", err3);
              return res.status(500).json({ success: false, error: err3 });
            }
            res.json({ success: true, insertId: result.insertId });
          });
        }
      );
    }
  );
});

// Editar una recepción
app.put("/api/recepciones/:id", (req, res) => {
  const { id } = req.params;
  const {
    id_proveedor,
    almacen,
    fecha_recepcion,
    fecha_documento,
    numero_documento,
    tipo_producto,
    cantidad,
    marca,
    estatus,
    total,
  } = req.body;

  // Log the data received from the frontend
  console.log("📥 Datos recibidos del frontend:", req.body);

  // Validar campos obligatorios
  if (
    !id_proveedor ||
    !almacen ||
    !fecha_recepcion ||
    !numero_documento ||
    !tipo_producto ||
    !cantidad ||
    !marca ||
    !estatus ||
    !total
  ) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos son obligatorios.",
    });
  }

  const sql = `
    UPDATE recepcionesmercancia
    SET id_proveedor = ?, almacen = ?, fecha_recepcion = ?, fecha_documento = ?, numero_documento = ?, tipo_producto = ?, cantidad = ?, marca = ?, estatus = ?, total = ?
    WHERE id_recepcion = ?
  `;

  const valores = [
    id_proveedor,
    almacen,
    fecha_recepcion,
    fecha_documento || null, // Permitir null para fecha_documento
    numero_documento,
    tipo_producto,
    cantidad,
    marca,
    estatus,
    total,
    id,
  ];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar recepción:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

// Eliminar una recepción
app.delete("/api/recepciones/:id", (req, res) => {
  const { id } = req.params; // Este ID debe ser recibido correctamente del frontend
  console.log("ID recibido para eliminación:", id); // Verifica que el ID llegue correctamente
  const sql = "DELETE FROM recepcionesmercancia WHERE id_recepcion = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar recepción:", err);
      return res.status(500).json({ success: false, error: err });
    }
    console.log("Registro eliminado con éxito:", result);
    res.json({ success: true });
  });
});

/* ------------------------------------- */
/* 🔹 GESTIONAR EMPLEADOS               */
/* ------------------------------------- */

// Obtener todos los empleados
app.get("/api/usuarios", (req, res) => {
  const sql = `
    SELECT u.id_usuario, u.nombre, u.email, u.telefono, u.contraseña, u.activo,
           r.nombre_rol AS rol
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error en consulta:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la consulta" });
    }

    res.json({ success: true, usuarios: result });
  });
});

// Agregar un nuevo empleado
// Agregar un nuevo empleado
app.post("/api/usuarios", async (req, res) => {
  console.log("📥 Datos recibidos para crear usuario:", req.body); // 🧪 DEBUG
  const { nombre, email, password, telefono, id_rol, activo } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO usuarios (nombre, email, contraseña, telefono, id_rol, activo, fecha_contratacion, fecha_creacion)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const valores = [nombre, email, hashedPassword, telefono, id_rol, activo];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error("❌ Error al insertar en la base de datos:", err); // ⛔️
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true, insertId: result.insertId });
  });
});

// Actualizar empleado
app.put("/api/usuarios/:id", async (req, res) => {
  const { nombre, email, password, telefono, id_rol, activo } = req.body;
  const { id } = req.params; // El ID del usuario a actualizar

  let sql;
  let valores;

  // Si se incluye la contraseña, la actualiza
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    sql = `
      UPDATE usuarios
      SET nombre = ?, email = ?, contraseña = ?, telefono = ?, id_rol = ?, activo = ?
      WHERE id_usuario = ?
    `;
    valores = [
      nombre,
      email,
      hashedPassword,
      telefono,
      id_rol,
      activo, // Actualizamos el estado 'activo' también
      id,
    ];
  } else {
    sql = `
      UPDATE usuarios
      SET nombre = ?, email = ?, telefono = ?, id_rol = ?, activo = ?
      WHERE id_usuario = ?
    `;
    valores = [nombre, email, telefono, id_rol, activo, id];
  }

  // Ejecutar la actualización en la base de datos
  db.query(sql, valores, (err) => {
    if (err) {
      console.error("❌ Error al actualizar usuario:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

// Eliminar empleado
app.delete("/api/usuarios/:id", (req, res) => {
  const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true });
  });
});

/* ------------------------------------- */
/* 🔹 GESTION ROLES                     */
/* ------------------------------------- */

app.get("/api/roles", (req, res) => {
  db.query("SELECT * FROM roles", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, roles: result });
  });
});

/* ------------------------------------- */
/* 🔹 GESTION MOVIMIENTOS               */
/* ------------------------------------- */

// Ruta para obtener los movimientos
app.get("/api/movimientos", (req, res) => {
  const sql = `
    SELECT 
      m.id_movimiento,
      m.tipo_movimiento,
      p.nombre AS producto, -- Asegúrate de que esta columna exista en la tabla productos
      m.cantidad,
      u.nombre AS empleado, -- Asegúrate de que esta columna exista en la tabla usuarios
      m.fecha_movimiento
    FROM movimientosinventario m
    LEFT JOIN productos p ON m.id_producto = p.id_producto
    LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error al obtener movimientos:", err); // Log de error
      return res.status(500).json({ success: false, error: err });
    }
    console.log("📋 Movimientos obtenidos desde la BD:", result); // Log de datos
    res.json({ success: true, movimientos: result });
  });
});

// POST: Crear un nuevo movimiento
app.post("/api/movimientos", (req, res) => {
  const {
    tipo_movimiento,
    id_producto,
    cantidad,
    fecha_movimiento,
    id_usuario,
  } = req.body;

  if (!tipo_movimiento || !id_producto || !cantidad || !id_usuario) {
    console.error("❌ Faltan campos obligatorios en la solicitud:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Faltan campos obligatorios." });
  }

  const sqlInsert = `
    INSERT INTO movimientosinventario 
    (tipo_movimiento, id_producto, cantidad, fecha_movimiento, id_usuario) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const sqlUpdateStock = `
    UPDATE productos 
    SET stock_actual = stock_actual + ? 
    WHERE id_producto = ?
  `;

  const sqlCheckStock = `
    SELECT stock_actual, stock_minimo, nombre 
    FROM productos 
    WHERE id_producto = ?
  `;

  db.query(sqlCheckStock, [id_producto], (errCheck, stockResults) => {
    if (errCheck) {
      console.error("❌ Error al verificar stock:", errCheck);
      return res
        .status(500)
        .json({ success: false, message: "Error al verificar stock." });
    }

    const { stock_actual, stock_minimo, nombre } = stockResults[0];
    let cantidadImpacto =
      tipo_movimiento.toLowerCase() === "entrada" ? cantidad : -cantidad;

    // Validar si la salida supera el nivel actual
    if (
      tipo_movimiento.toLowerCase() === "salida" &&
      stock_actual + cantidadImpacto < 0
    ) {
      return res.status(400).json({
        success: false,
        message: `No se puede realizar la salida. El nivel actual del producto "${nombre}" es ${stock_actual}.`,
      });
    }

    // Insertar movimiento
    db.query(
      sqlInsert,
      [
        tipo_movimiento,
        id_producto,
        cantidad,
        fecha_movimiento || new Date(),
        id_usuario,
      ],
      (errInsert, result) => {
        if (errInsert) {
          console.error("❌ Error al insertar movimiento:", errInsert);
          return res
            .status(500)
            .json({ success: false, message: "Error en la base de datos." });
        }

        // Actualizar stock_actual
        db.query(
          sqlUpdateStock,
          [cantidadImpacto, id_producto],
          (errUpdate) => {
            if (errUpdate) {
              console.error("❌ Error al actualizar stock:", errUpdate);
              return res.status(500).json({
                success: false,
                message: "Error al actualizar stock.",
              });
            }

            // Verificar si el nivel actual llegó a 0 o al nivel mínimo
            db.query(
              sqlCheckStock,
              [id_producto],
              (errFinalCheck, finalStock) => {
                if (errFinalCheck) {
                  console.error(
                    "❌ Error al verificar stock final:",
                    errFinalCheck
                  );
                  return res.status(500).json({
                    success: false,
                    message: "Error al verificar stock final.",
                  });
                }

                const { stock_actual: nuevoStock, stock_minimo: nuevoMinimo } =
                  finalStock[0];
                if (nuevoStock === 0) {
                  return res.status(200).json({
                    success: true,
                    warning: true,
                    message: `El producto "${nombre}" se ha agotado. El nivel actual es 0.`,
                  });
                } else if (nuevoStock <= nuevoMinimo) {
                  return res.status(200).json({
                    success: true,
                    warning: true,
                    message: `El producto "${nombre}" ha alcanzado el nivel mínimo (${nuevoMinimo}). El nivel actual es ${nuevoStock}.`,
                  });
                }

                res.json({ success: true });
              }
            );
          }
        );
      }
    );
  });
});

// PUT: Editar un movimiento existente
app.put("/api/movimientos/:id", (req, res) => {
  const { id } = req.params;
  const {
    tipo_movimiento,
    id_producto,
    cantidad,
    fecha_movimiento,
    id_usuario,
  } = req.body;

  if (!tipo_movimiento || !id_producto || !cantidad || !id_usuario) {
    console.error("❌ Faltan campos obligatorios en la solicitud:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "Faltan campos obligatorios." });
  }

  const sqlGetMovimiento = `
    SELECT * FROM movimientosinventario WHERE id_movimiento = ?
  `;

  const sqlUpdateMovimiento = `
    UPDATE movimientosinventario 
    SET tipo_movimiento = ?, id_producto = ?, cantidad = ?, fecha_movimiento = ?, id_usuario = ? 
    WHERE id_movimiento = ?
  `;

  const sqlUpdateStock = `
    UPDATE productos 
    SET stock_actual = stock_actual + ? 
    WHERE id_producto = ?
  `;

  db.query(sqlGetMovimiento, [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener movimiento:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener movimiento." });
    }

    const movimientoAnterior = results[0];
    const cantidadRevertir =
      movimientoAnterior.tipo_movimiento.toLowerCase() === "entrada"
        ? -movimientoAnterior.cantidad
        : movimientoAnterior.cantidad;

    const cantidadImpacto =
      tipo_movimiento.toLowerCase() === "entrada" ? cantidad : -cantidad;

    // Revertir impacto del movimiento anterior
    db.query(
      sqlUpdateStock,
      [cantidadRevertir, movimientoAnterior.id_producto],
      (errRevert) => {
        if (errRevert) {
          console.error("❌ Error al revertir stock:", errRevert);
          return res
            .status(500)
            .json({ success: false, message: "Error al revertir stock." });
        }

        // Actualizar movimiento con los nuevos valores
        db.query(
          sqlUpdateMovimiento,
          [
            tipo_movimiento,
            id_producto,
            cantidad,
            fecha_movimiento || new Date(),
            id_usuario,
            id,
          ],
          (errUpdate) => {
            if (errUpdate) {
              console.error("❌ Error al actualizar movimiento:", errUpdate);
              return res.status(500).json({
                success: false,
                message: "Error al actualizar movimiento.",
              });
            }

            // Aplicar impacto del nuevo movimiento
            db.query(
              sqlUpdateStock,
              [cantidadImpacto, id_producto],
              (errImpacto) => {
                if (errImpacto) {
                  console.error(
                    "❌ Error al aplicar impacto de stock:",
                    errImpacto
                  );
                  return res.status(500).json({
                    success: false,
                    message: "Error al aplicar impacto de stock.",
                  });
                }

                res.json({ success: true });
              }
            );
          }
        );
      }
    );
  });
});

// DELETE: Eliminar un movimiento
app.delete("/api/movimientos/:id", (req, res) => {
  const { id } = req.params;

  const sqlGetMovimiento = `
    SELECT * FROM movimientosinventario WHERE id_movimiento = ?
  `;

  const sqlDeleteMovimiento = `
    DELETE FROM movimientosinventario WHERE id_movimiento = ?
  `;

  const sqlUpdateStock = `
    UPDATE productos 
    SET stock_actual = stock_actual + ? 
    WHERE id_producto = ?
  `;

  db.query(sqlGetMovimiento, [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener movimiento:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener movimiento." });
    }

    const movimiento = results[0];
    const cantidadRevertir =
      movimiento.tipo_movimiento.toLowerCase() === "entrada"
        ? -movimiento.cantidad
        : movimiento.cantidad;

    // Revertir impacto del movimiento
    db.query(
      sqlUpdateStock,
      [cantidadRevertir, movimiento.id_producto],
      (errRevert) => {
        if (errRevert) {
          console.error("❌ Error al revertir stock:", errRevert);
          return res
            .status(500)
            .json({ success: false, message: "Error al revertir stock." });
        }

        // Eliminar movimiento
        db.query(sqlDeleteMovimiento, [id], (errDelete) => {
          if (errDelete) {
            console.error("❌ Error al eliminar movimiento:", errDelete);
            return res.status(500).json({
              success: false,
              message: "Error al eliminar movimiento.",
            });
          }

          res.json({ success: true });
        });
      }
    );
  });
});

// Example: Ensure all error responses are JSON
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err);
  res.status(500).json({ success: false, message: "Error en el servidor" });
});

/* ------------------------------------- */
/* 🔹 INICIAR SERVIDOR                  */
/* ------------------------------------- */
const PORT = 5000;
app.listen(PORT, () => console.log(`🔥 Servidor en http://localhost:${PORT}`));
