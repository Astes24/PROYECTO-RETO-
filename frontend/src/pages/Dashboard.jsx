import React, { useEffect, useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { CitaCard } from '../components/CitaCard';
import { CitaForm } from '../components/CitaForm';
import { Modal } from '../components/Modal';
import { api } from '../api/client';
import { useToast } from '../components/Toast';

export const Dashboard = () => {
  const [resumen, setResumen] = useState(null);
  const [citasHoy, setCitasHoy] = useState([]);
  const [leadsRecientes, setLeadsRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [res, hoy, leadsRes] = await Promise.all([
        api.getResumen(),
        api.getCitasHoy(),
        api.getLeads()
      ]);
      setResumen(res);
      setCitasHoy(hoy);
      // Sort leads by created_at desc, take top 5
      const sortedLeads = (leadsRes || []).sort((a, b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha));
      setLeadsRecientes(sortedLeads.slice(0, 5));
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangeEstado = async (id, estado) => {
    try {
      await api.cambiarEstadoCita(id, estado);
      addToast('Estado actualizado', 'success');
      loadData();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleSaveCita = async (data) => {
    try {
      await api.updateCita(selectedCita.id, data);
      addToast('Cita actualizada correctamente', 'success');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta cita?')) return;
    try {
      await api.deleteCita(id);
      addToast('Cita eliminada', 'success');
      loadData();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const openEdit = (cita) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard</h1>
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <MetricCard icon="👥" label="Total Leads" value={resumen?.totalLeads || 0} color="accent" />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <MetricCard icon="📅" label="Citas Hoy" value={resumen?.citasHoy || 0} color="warning" />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <MetricCard icon="✅" label="Citas Confirmadas" value={resumen?.citasConfirmadas || 0} color="success" />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <MetricCard icon="⏳" label="Citas Pendientes" value={resumen?.citasPendientes || 0} color="warning" />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <MetricCard icon="🚫" label="Citas Canceladas" value={resumen?.citasCanceladas || 0} color="danger" />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <MetricCard icon="🔁" label="Citas Reprogramadas" value={resumen?.citasReprogramadas || 0} color="accent" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Agenda de Hoy</h2>
          <div className="flex flex-col gap-4">
            {citasHoy.length === 0 ? (
              <div className="glass p-6 text-center text-secondary">No hay citas programadas para hoy.</div>
            ) : (
              citasHoy.map(cita => (
                <CitaCard 
                  key={cita.id} 
                  cita={cita} 
                  onChangeEstado={handleChangeEstado}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Leads Recientes</h2>
          <div className="glass flex flex-col gap-0" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {leadsRecientes.length === 0 ? (
              <div className="p-4 text-center text-secondary">No hay leads recientes.</div>
            ) : (
              leadsRecientes.map(lead => (
                <div key={lead.id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{lead.nombre}</div>
                    <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{lead.fuente}</div>
                  </div>
                  <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                    {new Date(lead.created_at || lead.fecha).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Cita"
      >
        <CitaForm
          cita={selectedCita}
          onSubmit={handleSaveCita}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
