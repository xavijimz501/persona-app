const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validatePersona(req, res, next) {
  const { nombre, nombre_empresa, correo, telefono, entidad } = req.body;
  const errors = {};
  if (typeof nombre !== 'string' || !nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
  else if (nombre.trim().length > 150) errors.nombre = 'Máximo 150 caracteres.';
  if (typeof nombre_empresa !== 'string' || !nombre_empresa.trim()) errors.nombre_empresa = 'La empresa es obligatoria.';
  else if (nombre_empresa.trim().length > 180) errors.nombre_empresa = 'Máximo 180 caracteres.';
  if (typeof correo !== 'string' || !emailPattern.test(correo.trim())) errors.correo = 'Ingresa un correo válido.';
  else if (correo.trim().length > 190) errors.correo = 'Máximo 190 caracteres.';
  if (typeof telefono !== 'string' || !telefono.trim()) errors.telefono = 'El teléfono es obligatorio.';
  else if (!/^[+\d\s().-]{7,25}$/.test(telefono.trim())) errors.telefono = 'Ingresa un teléfono válido.';
  if (typeof entidad !== 'string' || !entidad.trim()) errors.entidad = 'La entidad es obligatoria.';
  else if (entidad.trim().length > 120) errors.entidad = 'Máximo 120 caracteres.';
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Revisa los campos del formulario.', errors });
  req.persona = { nombre: nombre.trim(), nombre_empresa: nombre_empresa.trim(), correo: correo.trim().toLowerCase(), telefono: telefono.trim(), entidad: entidad.trim() };
  next();
}
