function initials(name = '') { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function formatDate(value) { return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); }
export default function PersonasTable({ personas, loading, onEdit, onDelete }) {
  return (
    <div className="table-scroll"><table><thead><tr><th>PERSONA</th><th>EMPRESA</th><th>CONTACTO</th><th>ENTIDAD</th><th>REGISTRO</th><th><span className="sr-only">Acciones</span></th></tr></thead>
      <tbody>{loading ? <tr><td colSpan="6" className="table-message">Cargando registros…</td></tr> : personas.length === 0 ? <tr><td colSpan="6" className="table-message">No encontramos personas con esos criterios.</td></tr> : personas.map((persona) => <tr key={persona.id}>
        <td><div className="person-cell"><span className="avatar">{initials(persona.nombre)}</span><span className="person-name">{persona.nombre}<small>Ref. {String(persona.id).padStart(4, '0')}</small></span></div></td>
        <td className="company-cell">{persona.nombre_empresa}</td><td><span className="contact-cell">{persona.correo}<small>{persona.telefono}</small></span></td><td><span className="location-pill">{persona.entidad}</span></td><td className="date-cell">{formatDate(persona.created_at)}</td>
        <td><div className="row-actions"><button type="button" className="icon-button" onClick={() => onEdit(persona)} aria-label={`Editar a ${persona.nombre}`} title="Editar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m13.8 3.2 3 3-9.6 9.6-4.1 1.1 1.1-4.1 9.6-9.6Z"/><path d="m11.9 5.1 3 3"/></svg></button><button type="button" className="icon-button icon-danger" onClick={() => onDelete(persona)} aria-label={`Eliminar a ${persona.nombre}`} title="Eliminar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 6h11M8 6V4h4v2m2.5 0-.7 10H6.2L5.5 6m3 3v4m3-4v4"/></svg></button></div></td>
      </tr>)}</tbody></table></div>
  );
}
