import React, { useEffect, useState } from 'react';
import { LeadTable } from '../components/LeadTable';
import { LeadForm } from '../components/LeadForm';
import { CitaForm } from '../components/CitaForm';
import { Modal } from '../components/Modal';
import { api } from '../api/client';
import { useToast } from '../components/Toast';

export const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCitaModalOpen, setIsCitaModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  const { addToast } = useToast();

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getLeads();
      setLeads(data);
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSaveLead = async (data) => {
    try {
      if (selectedLead) {
        await api.updateLead(selectedLead.id, data);
        addToast('Lead actualizado correctamente', 'success');
      } else {
        await api.createLead(data);
        addToast('Lead creado correctamente', 'success');
      }
      setIsLeadModalOpen(false);
      loadLeads();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleSaveCita = async (data) => {
    try {
      await api.createCita(data);
      addToast('Cita programada correctamente', 'success');
      setIsCitaModalOpen(false);
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const openEdit = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const openCreateCita = (lead) => {
    setSelectedLead(lead);
    setIsCitaModalOpen(true);
  };

  const openCreateLead = () => {
    setSelectedLead(null);
    setIsLeadModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Leads</h1>
        <button className="btn btn-primary" onClick={openCreateLead}>
          + Nuevo Lead
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '400px' }}></div>
      ) : (
        <LeadTable 
          leads={leads} 
          onEdit={openEdit} 
          onCreateCita={openCreateCita}
          onView={() => {}} 
        />
      )}

      <Modal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        title={selectedLead ? 'Editar Lead' : 'Nuevo Lead'}
      >
        <LeadForm 
          lead={selectedLead} 
          onSubmit={handleSaveLead} 
          onCancel={() => setIsLeadModalOpen(false)} 
        />
      </Modal>

      <Modal 
        isOpen={isCitaModalOpen} 
        onClose={() => setIsCitaModalOpen(false)} 
        title={`Agendar Cita para ${selectedLead?.nombre}`}
      >
        <CitaForm 
          leadId={selectedLead?.id}
          onSubmit={handleSaveCita} 
          onCancel={() => setIsCitaModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};
