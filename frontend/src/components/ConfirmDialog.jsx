import React from 'react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title}>
    <p className="text-secondary">{message}</p>
    <div className="modal-actions">
      <button type="button" className="btn btn-outline" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button type="button" className="btn btn-danger" onClick={onConfirm}>
        {confirmLabel}
      </button>
    </div>
  </Modal>
);
