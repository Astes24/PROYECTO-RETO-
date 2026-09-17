import React, { useState, useEffect, useRef } from 'react';

export const WhatsAppSim = ({ mensajes, onSendMessage, contact }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="glass flex flex-col" style={{ height: '600px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'rgba(30, 41, 59, 0.9)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem'
        }}>
          👤
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{contact?.nombre || 'Seleccione un chat'}</div>
          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{contact?.telefono || ''}</div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
        backgroundSize: 'contain',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(15, 23, 42, 0.95)'
      }}>
        {mensajes.length === 0 ? (
          <div className="text-center text-secondary mt-4">No hay mensajes en esta conversación.</div>
        ) : (
          mensajes.map((msg, idx) => {
            const isOutgoing = msg.direccion === 'saliente';
            return (
              <div key={idx} style={{
                alignSelf: isOutgoing ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderBottomRightRadius: isOutgoing ? '0' : '1rem',
                borderBottomLeftRadius: !isOutgoing ? '0' : '1rem',
                background: isOutgoing ? '#056162' : 'var(--bg-secondary)',
                color: '#fff',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative'
              }}>
                <div style={{ fontSize: '0.9rem' }}>{msg.contenido}</div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'right',
                  marginTop: '0.25rem'
                }}>
                  {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={{
        padding: '1rem',
        background: 'rgba(30, 41, 59, 0.9)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          className="form-control"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!contact}
          style={{ borderRadius: 'var(--radius-full)' }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem' }} disabled={!contact}>
          Enviar 🚀
        </button>
      </form>
    </div>
  );
};
