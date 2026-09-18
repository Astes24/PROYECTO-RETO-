import React, { useCallback, useEffect, useId, useState } from 'react';
import { WhatsAppSim } from '../components/WhatsAppSim';
import { Modal } from '../components/Modal';
import { api } from '../api/client';
import { useToast } from '../components/toast-context';
import { IconBell, IconUsers } from '../components/icons';

export const WhatsApp = () => {
  const uid = useId();
  const [leads, setLeads] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [simPhone, setSimPhone] = useState('');
  const [simMessage, setSimMessage] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { addToast } = useToast();

  const loadLeads = useCallback(async () => {
    try {
      const data = await api.getLeads();
      setLeads(data.filter((l) => l.telefono));
    } catch (err) {
      addToast(err.message, 'error');
    }
  }, [addToast]);

  const loadMensajes = useCallback(async (telefono) => {
    if (!telefono) return;
    try {
      setMensajes(await api.getMensajes(telefono));
    } catch (err) {
      addToast(err.message, 'error');
    }
  }, [addToast]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    if (!selectedContact) {
      setMensajes([]);
      return;
    }
    loadMensajes(selectedContact.telefono);
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') loadMensajes(selectedContact.telefono);
    }, 5000);
    return () => clearInterval(id);
  }, [selectedContact, loadMensajes]);

  const handleSend = async (texto) => {
    if (!selectedContact) return;
    try {
      await api.enviarMensaje({ telefono: selectedContact.telefono, mensaje: texto });
      loadMensajes(selectedContact.telefono);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSimular = async (e) => {
    e.preventDefault();
    if (!simPhone.trim() || !simMessage.trim()) {
      setError('Teléfono y mensaje son obligatorios.');
      return;
    }
    try {
      setEnviando(true);
      await api.enviarWebhook({ telefono: simPhone.trim(), mensaje: simMessage.trim() });
      addToast('Mensaje entrante simulado', 'success');
      const telefono = simPhone.trim();
      setModalOpen(false);
      setSimPhone('');
      setSimMessage('');
      setError('');
      await loadLeads();
      if (selectedContact?.telefono === telefono) loadMensajes(telefono);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>WhatsApp</h1>
          <p>Bandeja simulada: recibe y responde mensajes sin la API real.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={() => setModalOpen(true)}>
          <IconBell />
          Simular mensaje entrante
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <section className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <header style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1rem' }}>Conversaciones</h2>
            <p className="list-sub">{leads.length} contactos</p>
          </header>
          <div style={{ overflowY: 'auto', maxHeight: 'min(560px, 60dvh)' }}>
            {leads.length === 0 ? (
              <div className="empty">
                <span className="empty-icon"><IconUsers /></span>
                <div>
                  <strong>Sin contactos</strong>
                  <p>Crea un lead con teléfono o simula un mensaje entrante.</p>
                </div>
              </div>
            ) : (
              leads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  className={`conv${selectedContact?.id === lead.id ? ' is-active' : ''}`}
                  onClick={() => setSelectedContact(lead)}
                  aria-pressed={selectedContact?.id === lead.id}
                >
                  <div className="list-title">{lead.nombre}</div>
                  <div className="list-sub num">{lead.telefono}</div>
                </button>
              ))
            )}
          </div>
        </section>

        <div className="grid" style={{ gridColumn: 'span 2' }}>
          <WhatsAppSim contact={selectedContact} mensajes={mensajes} onSendMessage={handleSend} />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Simular mensaje entrante">
        <form onSubmit={handleSimular} noValidate>
          {error && <div className="error-state mb-4">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor={`${uid}-tel`}>Teléfono del remitente *</label>
            <input
              id={`${uid}-tel`}
              className="form-control num"
              value={simPhone}
              onChange={(e) => { setSimPhone(e.target.value); setError(''); }}
              placeholder="Ej. +52 55 1234 5678"
              aria-invalid={error ? 'true' : undefined}
            />
            <span className="field-hint">Si el número no existe, se crea un lead automáticamente.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`${uid}-msg`}>Mensaje *</label>
            <textarea
              id={`${uid}-msg`}
              className="form-control"
              value={simMessage}
              onChange={(e) => { setSimMessage(e.target.value); setError(''); }}
              placeholder="Hola, quiero agendar una cita"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Simular recepción'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
