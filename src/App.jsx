import { useCallback, useEffect, useState } from "react";
import PersonaForm from "./components/PersonaForm";
import PersonasTable from "./components/PersonasTable";
import { personasApi } from "./services/personas";
import "./App.css";

const PAGE_SIZE = 8;
function App() {
  const [personas, setPersonas] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const loadPersonas = useCallback(async (page = 1, term = "") => {
    setLoading(true);
    try {
      const result = await personasApi.list({
        page,
        limit: PAGE_SIZE,
        search: term,
      });
      setPersonas(result.data);
      setPagination(result.pagination);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadPersonas(1, ""), 0);
    return () => clearTimeout(timer);
  }, [loadPersonas]); // initial load
  useEffect(() => {
    const timer = setTimeout(() => loadPersonas(1, searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput, loadPersonas]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  async function savePersona(form, setErrors) {
    setSaving(true);
    try {
      if (selected) await personasApi.update(selected.id, form);
      else await personasApi.create(form);
      setSelected(null);
      setNotice({
        type: "success",
        text: selected
          ? "Cambios guardados correctamente."
          : "Persona agregada correctamente.",
      });
      await loadPersonas(1, searchInput.trim());
    } catch (error) {
      if (error.errors && Object.keys(error.errors).length)
        setErrors(error.errors);
      else setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }
  async function deletePersona(persona) {
    if (
      !window.confirm(
        `¿Eliminar a ${persona.nombre}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    try {
      await personasApi.remove(persona.id);
      const nextPage =
        personas.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page;
      setNotice({ type: "success", text: "Registro eliminado." });
      await loadPersonas(nextPage, searchInput.trim());
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }
  const countLabel = `${pagination.total} ${pagination.total === 1 ? "registro" : "registros"}`;
  return (
    <div className="app-shell">
      {/* <header className="topbar"><a className="brand" href="/registro" aria-label="Nexo, inicio"><span className="brand-mark"><i /><i /><i /><i /></span><span>nexo<span className="brand-dot">.</span></span></a><div className="topbar-right"><span className="workspace-label">DIRECTORIO DE CONTACTOS</span><span className="user-avatar">NX</span></div></header> */}
      <main className="main-content">
        {/* <div className="breadcrumb"><span>Directorio</span><span className="crumb-separator">/</span><strong>Personas</strong></div> */}
        <section className="page-heading">
          <div>
            <h1>
              Personas<span className="heading-period">.</span>
            </h1>
          </div>
          <div className="heading-stat">
            <span className="stat-number">
              {String(pagination.total).padStart(2, "0")}
            </span>
            <span className="stat-label">
              CONTACTOS
              <br />
              EN DIRECTORIO
            </span>
          </div>
        </section>
        {notice && (
          <div role="status" className={`notice notice-${notice.type}`}>
            <span>{notice.type === "success" ? "✓" : "!"}</span>
            {notice.text}
            <button onClick={() => setNotice(null)} aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        )}
        <PersonaForm
          key={selected?.id || "new-persona"}
          selected={selected}
          onSave={savePersona}
          onCancel={() => setSelected(null)}
          saving={saving}
        />
        <section className="directory-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BASE DE DATOS</span>
              <h2>
                Directorio <span className="record-count">{countLabel}</span>
              </h2>
            </div>
            <label className="search-box">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8.8" cy="8.8" r="5.8" />
                <path d="m13 13 4 4" />
              </svg>
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Buscar persona…"
                aria-label="Buscar personas"
              />
              <kbd>⌘ K</kbd>
            </label>
          </div>
          <div className="table-card">
            <PersonasTable
              personas={personas}
              loading={loading}
              onEdit={setSelected}
              onDelete={deletePersona}
            />
            <footer className="table-footer">
              <span>
                Mostrando{" "}
                <strong>
                  {pagination.total ? (pagination.page - 1) * PAGE_SIZE + 1 : 0}
                  –{Math.min(pagination.page * PAGE_SIZE, pagination.total)}
                </strong>{" "}
                de <strong>{pagination.total}</strong>
              </span>
              <div className="pagination">
                <button
                  type="button"
                  aria-label="Página anterior"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => loadPersonas(pagination.page - 1)}
                >
                  <span>←</span> Anterior
                </button>
                <span className="page-indicator">
                  {pagination.page} <i>/</i>{" "}
                  {Math.max(pagination.totalPages, 1)}
                </span>
                <button
                  type="button"
                  aria-label="Página siguiente"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => loadPersonas(pagination.page + 1)}
                >
                  Siguiente <span>→</span>
                </button>
              </div>
            </footer>
          </div>
        </section>
        <div className="page-note">
          <span className="note-mark">✳</span> Los datos de tu directorio se
          mantienen organizados y actualizados.
        </div>
      </main>
      {/* <footer className="site-footer"><span>© 2025 Nexo Directorio</span><span>Hecho para conectar.</span></footer> */}
    </div>
  );
}
export default App;
