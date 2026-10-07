import { useState } from 'react';

const EMPTY = { nombre: '', nombre_empresa: '', correo: '', telefono: '', entidad: '' };
const FIELDS = [
  { name: 'nombre', label: 'Nombre completo', placeholder: 'Ej. Ana García', autoComplete: 'name' },
  { name: 'nombre_empresa', label: 'Nombre de empresa', placeholder: 'Ej. Norte Studio', autoComplete: 'organization' },
  { name: 'correo', label: 'Correo electrónico', placeholder: 'nombre@empresa.com', type: 'email', autoComplete: 'email' },
  { name: 'telefono', label: 'Teléfono', placeholder: '+52 55 1234 5678', type: 'tel', autoComplete: 'tel' },
  { name: 'entidad', label: 'Entidad / estado', placeholder: 'Ej. Ciudad de México', autoComplete: 'address-level1' },
];

export default function PersonaForm({ selected, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => selected ? Object.fromEntries(Object.keys(EMPTY).map((key) => [key, selected[key] || ''])) : EMPTY);
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    FIELDS.forEach(({ name, label }) => {
      if (!form[name].trim()) nextErrors[name] = `${label} es obligatorio.`;
    });
    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) nextErrors.correo = 'Ingresa un correo válido.';
    if (form.telefono && !/^[+\d\s().-]{7,25}$/.test(form.telefono)) nextErrors.telefono = 'Ingresa un teléfono válido.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    onSave(form, setErrors);
  }

  return (
    <form className="persona-form" onSubmit={submit} noValidate>
      <div className="form-heading"><div><span className="eyebrow">{selected ? 'ACTUALIZAR REGISTRO' : 'NUEVO REGISTRO'}</span><h2>{selected ? 'Editar persona' : 'Agregar persona'}</h2></div><span className="form-step">01 <i>/ 01</i></span></div>
      <div className="fields-grid">
        {FIELDS.map(({ name, label, placeholder, type = 'text', autoComplete }) => (
          <label className={`field ${name === 'entidad' ? 'field-wide' : ''}`} key={name}>
            <span>{label}<b aria-hidden="true">*</b></span>
            <input type={type} name={name} value={form[name]} placeholder={placeholder} autoComplete={autoComplete} maxLength={name === 'telefono' ? 25 : 190} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} onChange={(event) => { setForm({ ...form, [name]: event.target.value }); setErrors({ ...errors, [name]: '' }); }} />
            {errors[name] && <small className="field-error" id={`${name}-error`}>{errors[name]}</small>}
          </label>
        ))}
      </div>
      <div className="form-actions">{selected && <button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button>}<button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : selected ? 'Guardar cambios' : 'Crear registro'}<span aria-hidden="true">↗</span></button></div>
    </form>
  );
}
