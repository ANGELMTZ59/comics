const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming you have a database connection module

// Get all clients
router.get("/clientes", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).send("Error fetching clients");
  }
});

// Add a new client
router.post("/clientes", async (req, res) => {
  const {
    nombre,
    email,
    contraseña, // Use 'contraseña' to match the database column name
    telefono,
    direccion,
    nivel_membresia,
    frecuencia_compra,
  } = req.body;

  // Validate required fields
  if (!nombre || !email || !contraseña) {
    return res
      .status(400)
      .json({ success: false, message: "Campos requeridos faltantes." });
  }

  try {
    const result = await db.query(
      "INSERT INTO clientes (nombre, email, contraseña, telefono, direccion, nivel_membresia, frecuencia_compra) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        email,
        contraseña,
        telefono || null, // Allow null for optional fields
        direccion || null,
        nivel_membresia || "regular", // Default value
        frecuencia_compra || "baja", // Default value
      ]
    );
    res.status(201).json({
      success: true,
      cliente: { id_cliente: result.insertId, ...req.body },
    });
  } catch (error) {
    console.error("Error adding client:", error);
    if (error.code === "ER_BAD_FIELD_ERROR") {
      res.status(500).json({
        success: false,
        message: "Error en los campos enviados. Verifica la estructura.",
      });
    } else {
      res.status(500).json({ success: false, message: "Error adding client." });
    }
  }
});

module.exports = router;
