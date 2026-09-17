const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Error en la petición al servidor');
  }

  // El backend envuelve las respuestas en { success, data }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Leads
  getLeads: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI(`/leads${params ? `?${params}` : ''}`);
  },
  getLead: (id) => fetchAPI(`/leads/${id}`),
  createLead: (data) => fetchAPI('/leads', { method: 'POST', body: JSON.stringify(data) }),
  updateLead: (id, data) => fetchAPI(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLead: (id) => fetchAPI(`/leads/${id}`, { method: 'DELETE' }),

  // Citas
  getCitas: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI(`/citas${params ? `?${params}` : ''}`);
  },
  getCita: (id) => fetchAPI(`/citas/${id}`),
  createCita: (data) => fetchAPI('/citas', { method: 'POST', body: JSON.stringify(data) }),
  updateCita: (id, data) => fetchAPI(`/citas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cambiarEstadoCita: (id, estado) => fetchAPI(`/citas/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  deleteCita: (id) => fetchAPI(`/citas/${id}`, { method: 'DELETE' }),

  // WhatsApp
  enviarWebhook: (data) => fetchAPI('/whatsapp/webhook', { method: 'POST', body: JSON.stringify(data) }),
  enviarMensaje: (data) => fetchAPI('/whatsapp/enviar', { method: 'POST', body: JSON.stringify(data) }),
  getMensajes: (telefono) => fetchAPI(`/whatsapp/mensajes/${telefono}`),

  // Dashboard
  getResumen: () => fetchAPI('/dashboard/resumen'),
  getCitasHoy: () => fetchAPI('/dashboard/hoy'),
};
