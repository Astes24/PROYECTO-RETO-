import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconClose } from './icons';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
const FIRST_FIELD = 'input:not([type="hidden"]), select, textarea';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  const panelRef = useRef(null);
  const openerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  // Mantiene la referencia fresca sin volver a montar el efecto:
  // antes, un `onClose` nuevo en cada render reenfocaba el modal a cada tecla.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    openerRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const firstField = panel?.querySelector(FIRST_FIELD);
    (firstField || panel)?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;

      const nodes = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (nodes.length === 0) return;

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Cerrar">
            <IconClose />
          </button>
        </div>
        {children}
        {footer && <div className="modal-actions">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
