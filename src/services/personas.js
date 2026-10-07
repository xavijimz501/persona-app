const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'No se pudo completar la solicitud.');
    error.status = response.status;
    error.errors = payload.errors || {};
    throw error;
  }
  return payload;
}

export const personasApi = {
  list: ({ page = 1, limit = 8, search = '' } = {}) => {
    const query = new URLSearchParams({ page, limit, search });
    return request(`/personas?${query}`);
  },
  get: (id) => request(`/personas/${id}`),
  create: (persona) => request('/personas', { method: 'POST', body: JSON.stringify(persona) }),
  update: (id, persona) => request(`/personas/${id}`, { method: 'PUT', body: JSON.stringify(persona) }),
  remove: (id) => request(`/personas/${id}`, { method: 'DELETE' }),
};
