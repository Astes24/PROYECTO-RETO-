import React, { useEffect, useState } from 'react';
import { WhatsAppSim } from '../components/WhatsAppSim';
import { Modal } from '../components/Modal';
import { api } from '../api/client';
import { useToast } from '../components/Toast';

export const WhatsApp = () => {
  const [leads, setLeads] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [simPhone, setSimPhone] = useState('');
  const [simMessage, setSimMessage] = useState('');
  
  const { addToast } = useToast();

  const loadLeads = async () => {
    try {
      const data = await api.getLeads();
      // Filter leads that have phone
      setLeads(data.filter(l => l.telefono));
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const loadMessages = async (telefono) => {
    if (!telefono) return;
    try {
      const data = await api.getMensajes(telefono);
      setMensajes(data);
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact.telefono);
      // set up polling for new messages could go here
      const interval = setInterval(() => {
        loadMessages(selectedContact.telefono);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setMensajes([]);
    }
  }, [selectedContact]);

  const handleSendMessage = async (text) => {
    if (!selectedContact) return;
    try {
      await api.enviarMensaje({
        telefono: selectedContact.telefono,
        mensaje: text
      });
      loadMessages(selectedContact.telefono);
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleSimularWebhook = async (e) => {
    e.preventDefault();
    if (!simPhone || !simMessage) return;
    try {
      await api.enviarWebhook({
        telefono: simPhone,
        mensaje: simMessage
      });
      addToast('Mensaje entrante simulado', 'success');
      setIsSimModalOpen(false);
      setSimMessage('');
      setSimPhone('');
      loadLeads(); // refresh leads in case it's a new one
      if (selectedContact?.telefono === simPhone) {
        loadMessages(simPhone);
      }
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gradient" style={{ fontSize: '2rem' }}>WhatsApp Simulation</h1>
        <button className="btn btn-outline" onClick={() => setIsSimModalOpen(true)}>
          🔔 Simular Mensaje Entrante
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ flex: 1, minHeight: 0 }}>
        {/* Contacts List */}
        <div className="glass flex flex-col" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'rgba(30, 41, 59, 0.9)' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Conversaciones</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {leads.length === 0 ? (
              <div className="p-4 text-center text-secondary">No hay contactos con teléfono.</div>
            ) : (
              leads.map(lead => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedContact(lead)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: selectedContact?.id === lead.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    borderLeft: selectedContact?.id === lead.id ? '4px solid var(--accent)' : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-opacity-50"
                >
                  <div style={{ fontWeight: 500 }}>{lead.nombre}</div>
                  <div className="text-secondary" style={{ fontSize: '0.875rem' }}>{lead.telefono}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col">
          <WhatsAppSim 
            contact={selectedContact}
            mensajes={mensajes}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      <Modal 
        isOpen={isSimModalOpen} 
        onClose={() => setIsSimModalOpen(false)} 
        title="Simular Mensaje Entrante"
      >
        <form onSubmit={handleSimularWebhook}>
          <div className="form-group">
            <label className="form-label">Teléfono del Remitente</label>
            <input 
              className="form-control" 
              value={simPhone} 
              onChange={e => setSimPhone(e.target.value)} 
              placeholder="Ej. +34600123456" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mensaje</label>
            <textarea 
              className="form-control" 
              value={simMessage} 
              onChange={e => setSimMessage(e.target.value)} 
              placeholder="Hola, me gustaría agendar una cita..." 
              required 
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-outline" onClick={() => setIsSimModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Simular Recepción</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
