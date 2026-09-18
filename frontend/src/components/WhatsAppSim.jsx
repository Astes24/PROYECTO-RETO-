import React, { useEffect, useRef, useState } from 'react';
import { IconSend, IconUsers, IconInbox } from './icons';

export const WhatsAppSim = ({ mensajes, onSendMessage, contact }) => {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mensajes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const texto = input.trim();
    if (!texto || !contact) return;
    onSendMessage(texto);
    setInput('');
  };

  return (
    <section className="chat" aria-label="Conversación simulada de WhatsApp">
      <header className="chat-head">
        <span className="chat-avatar"><IconUsers /></span>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{contact?.nombre || 'Selecciona una conversación'}</div>
          <div className="list-sub num">{contact?.telefono || 'Sin contacto activo'}</div>
        </div>
      </header>

      <div className="chat-body">
        {mensajes.length === 0 ? (
          <div className="empty" style={{ margin: 'auto' }}>
            <span className="empty-icon"><IconInbox /></span>
            <div>
              <strong>Sin mensajes</strong>
              <p>Elige un contacto o simula un mensaje entrante.</p>
            </div>
          </div>
        ) : (
          mensajes.map((msg) => {
            const saliente = msg.direccion === 'saliente';
            return (
              <div key={msg.id} className={`chat-msg ${saliente ? 'out' : 'in'}`}>
                {msg.mensaje}
                <time>
                  {new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          id="chat-input"
          className="form-control"
          aria-label="Escribir mensaje"
          placeholder={contact ? 'Escribe un mensaje…' : 'Selecciona un contacto para escribir'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!contact}
          style={{ borderRadius: 'var(--r-full)' }}
        />
        <button type="submit" className="btn btn-primary" disabled={!contact || !input.trim()} style={{ borderRadius: 'var(--r-full)' }}>
          <IconSend />
          Enviar
        </button>
      </form>
    </section>
  );
};
