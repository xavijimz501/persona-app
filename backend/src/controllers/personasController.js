import pool from "../config/db.js";

const fields =
  "id, nombre, nombre_empresa, correo, telefono, entidad, created_at";
export async function listPersonas(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );
    const search = String(req.query.search || "")
      .trim()
      .slice(0, 150);
    const where = search
      ? "WHERE nombre LIKE ? OR nombre_empresa LIKE ? OR correo LIKE ? OR telefono LIKE ? OR entidad LIKE ?"
      : "";
    const params = search ? Array(5).fill(`%${search}%`) : [];
    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM personas ${where}`,
      params,
    );
    const [rows] = await pool.execute(
      `SELECT ${fields} FROM personas ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, limit, (page - 1) * limit],
    );
    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}
export async function getPersona(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT ${fields} FROM personas WHERE id = ?`,
      [req.params.id],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Persona no encontrada." });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}
export async function createPersona(req, res, next) {
  try {
    const { nombre, nombre_empresa, correo, telefono, entidad } = req.persona;
    const [result] = await pool.execute(
      "INSERT INTO personas (nombre, nombre_empresa, correo, telefono, entidad) VALUES (?, ?, ?, ?, ?)",
      [nombre, nombre_empresa, correo, telefono, entidad],
    );
    const [rows] = await pool.execute(
      `SELECT ${fields} FROM personas WHERE id = ?`,
      [result.insertId],
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res
        .status(409)
        .json({ message: "Ya existe una persona con ese correo." });
    next(error);
  }
}
export async function updatePersona(req, res, next) {
  try {
    const { nombre, nombre_empresa, correo, telefono, entidad } = req.persona;
    const [result] = await pool.execute(
      "UPDATE personas SET nombre = ?, nombre_empresa = ?, correo = ?, telefono = ?, entidad = ? WHERE id = ?",
      [nombre, nombre_empresa, correo, telefono, entidad, req.params.id],
    );
    if (!result.affectedRows)
      return res.status(404).json({ message: "Persona no encontrada." });
    const [rows] = await pool.execute(
      `SELECT ${fields} FROM personas WHERE id = ?`,
      [req.params.id],
    );
    res.json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res
        .status(409)
        .json({ message: "Ya existe una persona con ese correo." });
    next(error);
  }
}
export async function deletePersona(req, res, next) {
  try {
    const [result] = await pool.execute("DELETE FROM personas WHERE id = ?", [
      req.params.id,
    ]);
    if (!result.affectedRows)
      return res.status(404).json({ message: "Persona no encontrada." });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
