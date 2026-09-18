import React, { useCallback, useEffect, useState } from 'react';
import { LeadTable } from '../components/LeadTable';
import { LeadForm } from '../components/LeadForm';
import { CitaForm } from '../components/CitaForm';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { api } from '../api/client';
import { useToast } from '../components/toast-context';
import { IconPlus } from '../components/icons';

export const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadModal, setLeadModal] = useState(false);
  const [citaModal, setCitaModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [aBorrar, setABorrar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { addToast } = useToast();

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      setLeads(await api.getLeads());
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleGuardarLead = async (data) => {
    try {
      setGuardando(true);
      if (selectedLead) {
        await api.updateLead(selectedLead.id, data);
        addToast('Lead actualizado', 'success');
      } else {
        await api.createLead(data);
        addToast('Lead creado', 'success');
      }
      setLeadModal(false);
      loadLeads();
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarCita = async (data) => {
    try {
      setGuardando(true);
      await api.createCita(data);
      addToast('Cita agendada', 'success');
      setCitaModal(false);
      loadLeads();
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    try {
      await api.deleteLead(aBorrar.id);
      addToast('Lead eliminado', 'success');
      setABorrar(null);
      loadLeads();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Leads</h1>
          <p>Pacientes potenciales y su estado en el embudo.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => { setSelectedLead(null); setLeadModal(true); }}>
          <IconPlus />
          Nuevo lead
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 400 }} />
      ) : (
        <LeadTable
          leads={leads}
          onEdit={(lead) => { setSelectedLead(lead); setLeadModal(true); }}
          onCreateCita={(lead) => { setSelectedLead(lead); setCitaModal(true); }}
          onDelete={(lead) => setABorrar(lead)}
        />
      )}

      <Modal isOpen={leadModal} onClose={() => setLeadModal(false)} title={selectedLead ? 'Editar lead' : 'Nuevo lead'}>
        <LeadForm
          lead={selectedLead}
          onSubmit={handleGuardarLead}
          onCancel={() => setLeadModal(false)}
          submitting={guardando}
        />
      </Modal>

      <Modal
        isOpen={citaModal}
        onClose={() => setCitaModal(false)}
        title={`Agendar cita · ${selectedLead?.nombre || ''}`}
      >
        <CitaForm
          leadId={selectedLead?.id}
          onSubmit={handleGuardarCita}
          onCancel={() => setCitaModal(false)}
          submitting={guardando}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(aBorrar)}
        title="Eliminar lead"
        message={`Se eliminará ${aBorrar?.nombre || 'este lead'} junto con sus citas y mensajes. Esta acción no se puede deshacer.`}
        onConfirm={confirmarBorrado}
        onCancel={() => setABorrar(null)}
      />
    </>
  );
};
