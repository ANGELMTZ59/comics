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
    decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }

  const id_usuario = decoded.id;

  const sql = `
    SELECT u.id_usuario, u.email, u.id_rol, u.nombre AS nombre_usuario, 
           u.telefono, u.fecha_contratacion,
           r.nombre_rol AS puesto
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = ?
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

  const sql = `
    SELECT u.id_usuario, u.email, u.contraseña AS password, u.telefono, u.nombre, u.id_rol, u.activo, r.nombre_rol
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error en la BD" });
    if (results.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Usuario no encontrado" });

    const usuario = results[0];
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword)
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre,
        id_rol: usuario.id_rol, // ✅ Este es el que necesitas
      },
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
        telefono: usuario.telefono,
        id_rol: usuario.id_rol,
        activo: usuario.activo,
        fecha_contratacion: usuario.fecha_contratacion,
        rol: usuario.nombre_rol,
      },
    });
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

      const id = result.insertId;
      const sqlGet = "SELECT * FROM clientes WHERE id_cliente = ?";

      db.query(sqlGet, [id], (err2, clienteResult) => {
        if (err2) {
          return res.status(500).json({
            success: false,
            message: "Error al obtener cliente insertado",
          });
        }

        res.json({
          success: true,
          message: "Cliente agregado correctamente",
          cliente: clienteResult[0],
        });
      });
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
      n.titulo,
      n.mensaje,
      n.fecha_envio,
      n.leida
    FROM notificacionesclientes n
    LEFT JOIN clientes c ON n.id_cliente = c.id_cliente
    ORDER BY n.fecha_envio DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener notificaciones:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    }

    res.json({ success: true, notificaciones: results });
  });
});

app.post("/api/notificaciones", (req, res) => {
  const { id_cliente, id_promocion, titulo, mensaje, fecha_envio } = req.body;

  if (!id_cliente || !titulo || !mensaje || !fecha_envio) {
    return res.status(400).json({ success: false, message: "Faltan campos" });
  }

  const sql = `INSERT INTO notificaciones (id_cliente, id_promocion, titulo, mensaje, fecha_envio, leida)
               VALUES (?, ?, ?, ?, ?, 'no')`;

  db.query(
    sql,
    [id_cliente, id_promocion || null, titulo, mensaje, fecha_envio],
    (err, result) => {
      if (err) {
        console.error("❌ Error al insertar notificación:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error en la base de datos" });
      }

      const id = result.insertId;
      db.query(
        `SELECT n.*, c.nombre AS nombre_cliente FROM notificaciones n
       JOIN clientes c ON n.id_cliente = c.id_cliente
       WHERE n.id_notificacion = ?`,
        [id],
        (err2, result2) => {
          if (err2) {
            return res.status(500).json({
              success: false,
              message: "Error al obtener notificación insertada",
            });
          }

          res.json({ success: true, notificacion: result2[0] });
        }
      );
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
    SELECT p.id_promocion, pr.nombre AS producto, p.descripcion, 
           CONCAT(p.descuento, '%') AS descuento, 
           p.fecha_inicio, p.fecha_fin, p.estado
    FROM promociones p
    JOIN productos pr ON p.id_producto = pr.id_producto
    ORDER BY p.fecha_inicio DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener promociones:", err);
      return res.status(500).json({ success: false, error: err });
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

// Agregar producto
app.post("/api/productos", (req, res) => {
  const {
    nombre,
    descripcion,
    categoria,
    stock_actual,
    precio,
    editorial_o_marca,
    fecha_lanzamiento,
  } = req.body;

  const sql = `
    INSERT INTO productos 
    (nombre, descripcion, categoria, stock_actual, precio, editorial_o_marca, fecha_lanzamiento)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nombre,
      descripcion,
      categoria,
      stock_actual,
      precio,
      editorial_o_marca,
      fecha_lanzamiento,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error al insertar producto:", err);
        return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, insertId: result.insertId });
    }
  );
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
      o.fecha_entrega_real
    FROM ordenesproveedores o
    JOIN productos p ON o.id_producto = p.id_producto
    JOIN proveedores pr ON o.id_proveedor = pr.id_proveedor
    ORDER BY o.id_orden DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener órdenes:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, ordenes: results });
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
           r.numero_documento AS numero, -- Use numero_documento instead of numero
           pr.nombre AS proveedor,
           r.almacen,
           r.fecha_recepcion,
           r.fecha_documento,
           r.numero_documento,
           r.tipo_producto,
           r.cantidad,
           r.marca,
           r.estatus,
           r.total
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
app.post("/api/recepciones", (req, res) => {
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
    INSERT INTO recepcionesmercancia 
    (id_proveedor, almacen, fecha_recepcion, fecha_documento, numero_documento, tipo_producto, cantidad, marca, estatus, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  ];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error("❌ Error al insertar recepción:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true, insertId: result.insertId });
  });
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

  let sql, valores;

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
      activo,
      req.params.id,
    ];
  } else {
    sql = `
      UPDATE usuarios
      SET nombre = ?, email = ?, telefono = ?, id_rol = ?, activo = ?
      WHERE id_usuario = ?
    `;
    valores = [nombre, email, telefono, id_rol, activo, req.params.id];
  }

  db.query(sql, valores, (err) => {
    if (err) return res.status(500).json({ success: false, error: err });
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

/* ------------------------------------- */
/* 🔹 INICIAR SERVIDOR                  */
/* ------------------------------------- */
const PORT = 5000;
app.listen(PORT, () => console.log(`🔥 Servidor en http://localhost:${PORT}`));
