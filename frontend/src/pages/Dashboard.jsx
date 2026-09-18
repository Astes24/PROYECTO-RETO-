import React, { useCallback, useEffect, useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { CitaCard } from '../components/CitaCard';
import { CitaForm } from '../components/CitaForm';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { api } from '../api/client';
import { useToast } from '../components/toast-context';
import {
  IconUsers, IconCalendar, IconCheck, IconClock, IconClose, IconRefresh, IconPlus, IconInbox
} from '../components/icons';

export const Dashboard = () => {
  const [resumen, setResumen] = useState(null);
  const [citasHoy, setCitasHoy] = useState([]);
  const [leadsRecientes, setLeadsRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [aBorrar, setABorrar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { addToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [res, hoy, leads] = await Promise.all([
        api.getResumen(),
        api.getCitasHoy(),
        api.getLeads()
      ]);
      setResumen(res);
      setCitasHoy(hoy || []);
      const ordenados = [...(leads || [])].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      setLeadsRecientes(ordenados.slice(0, 5));
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChangeEstado = async (id, estado) => {
    try {
      await api.cambiarEstadoCita(id, estado);
      addToast('Estado actualizado', 'success');
      loadData();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleGuardar = async (data) => {
    try {
      setGuardando(true);
      if (selectedCita) await api.updateCita(selectedCita.id, data);
      else await api.createCita(data);
      addToast(selectedCita ? 'Cita actualizada' : 'Cita agendada', 'success');
      setModalOpen(false);
      loadData();
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    try {
      await api.deleteCita(aBorrar.id);
      addToast('Cita eliminada', 'success');
      setABorrar(null);
      loadData();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const abrirEdicion = (cita) => {
    setSelectedCita(cita);
    setModalOpen(true);
  };

  const abrirCreacion = () => {
    setSelectedCita(null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <div className="page-head"><h1>Panel</h1></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton" style={{ height: 108 }} />)}
        </div>        <div className="skeleton" style={{ height: 240 }} />
      </>
    );
  }

  const hoyTexto = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Panel</h1>
          <p style={{ textTransform: 'capitalize' }}>{hoyTexto}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={abrirCreacion}>
          <IconPlus />
          Nueva cita
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard icon={<IconUsers />} label="Total de leads" value={resumen?.totalLeads ?? 0} hint={`${resumen?.leadsNuevos ?? 0} nuevos`} tone="primary" />
        <MetricCard icon={<IconCalendar />} label="Citas de hoy" value={resumen?.citasHoy ?? 0} hint="Agenda del día" tone="info" />
        <MetricCard icon={<IconCheck />} label="Confirmadas" value={resumen?.citasConfirmadas ?? 0} tone="accent" />
        <MetricCard icon={<IconClock />} label="Pendientes" value={resumen?.citasPendientes ?? 0} tone="warning" />
        <MetricCard icon={<IconClose />} label="Canceladas" value={resumen?.citasCanceladas ?? 0} tone="danger" />
        <MetricCard icon={<IconRefresh />} label="Reprogramadas" value={resumen?.citasReprogramadas ?? 0} tone="primary" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <section className="grid" style={{ gridColumn: 'span 2', gap: 'var(--sp-3)' }}>
          <h2>Agenda de hoy</h2>
          {citasHoy.length === 0 ? (
            <div className="panel empty">
              <span className="empty-icon"><IconCalendar /></span>
              <div>
                <strong>No hay citas para hoy</strong>
                <p>Agenda la primera para verla en este panel.</p>
              </div>
              <button type="button" className="btn btn-outline" onClick={abrirCreacion}>
                <IconPlus /> Nueva cita
              </button>
            </div>
          ) : (
            citasHoy.map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                onChangeEstado={handleChangeEstado}
                onEdit={abrirEdicion}
                onDelete={(id) => setABorrar({ id, nombre: cita.lead_nombre })}
              />
            ))
          )}
        </section>

        <section className="grid" style={{ gap: 'var(--sp-3)', alignContent: 'start' }}>
          <h2>Leads recientes</h2>
          <div className="panel list">
            {leadsRecientes.length === 0 ? (
              <div className="empty">
                <span className="empty-icon"><IconInbox /></span>
                <div><strong>Sin leads todavía</strong></div>
              </div>
            ) : (
              leadsRecientes.map((lead) => (
                <div key={lead.id} className="list-row">
                  <div>
                    <div className="list-title">{lead.nombre}</div>
                    <div className="list-sub" style={{ textTransform: 'capitalize' }}>{lead.fuente}</div>
                  </div>
                  <div className="list-sub num">
                    {new Date(lead.created_at || lead.fecha).toLocaleDateString('es', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCita ? 'Editar cita' : 'Nueva cita'}
      >
        <CitaForm
          cita={selectedCita}
          onSubmit={handleGuardar}
          onCancel={() => setModalOpen(false)}
          submitting={guardando}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(aBorrar)}
        title="Eliminar cita"
        message={`Se eliminará la cita de ${aBorrar?.nombre || 'este paciente'}. Esta acción no se puede deshacer.`}
        onConfirm={confirmarBorrado}
        onCancel={() => setABorrar(null)}
      />
    </>
  );
};
