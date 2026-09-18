import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CitaCard } from '../components/CitaCard';
import { CitaForm } from '../components/CitaForm';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { api } from '../api/client';
import { useToast } from '../components/toast-context';
import { IconPlus, IconCalendar } from '../components/icons';

const ESTADOS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'confirmada', label: 'Confirmadas' },
  { id: 'cancelada', label: 'Canceladas' },
  { id: 'reprogramada', label: 'Reprogramadas' }
];

export const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const filtro = params.get('estado') || 'todas';
  const fecha = params.get('fecha') || '';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const setFiltro = (valor) => setParam('estado', valor === 'todas' ? '' : valor);
  const setFecha = (valor) => setParam('fecha', valor);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [aBorrar, setABorrar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { addToast } = useToast();

  const loadCitas = useCallback(async () => {
    try {
      setLoading(true);
      setCitas(await api.getCitas());
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCitas();
  }, [loadCitas]);

  const conteos = useMemo(() => {
    return citas.reduce(
      (acc, c) => {
        const k = (c.estado || 'pendiente').toLowerCase();
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      },
      { todas: citas.length }
    );
  }, [citas]);

  const visibles = useMemo(() => {
    return citas.filter((c) => {
      const okEstado = filtro === 'todas' || (c.estado || 'pendiente').toLowerCase() === filtro;
      const okFecha = !fecha || String(c.fecha).slice(0, 10) === fecha;
      return okEstado && okFecha;
    });
  }, [citas, filtro, fecha]);

  const handleGuardar = async (data) => {
    try {
      setGuardando(true);
      if (selectedCita) {
        await api.updateCita(selectedCita.id, data);
        addToast('Cita actualizada', 'success');
      } else {
        await api.createCita(data);
        addToast('Cita agendada', 'success');
      }
      setModalOpen(false);
      loadCitas();
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleChangeEstado = async (id, estado) => {
    try {
      await api.cambiarEstadoCita(id, estado);
      addToast('Estado actualizado', 'success');
      loadCitas();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const confirmarBorrado = async () => {
    try {
      await api.deleteCita(aBorrar.id);
      addToast('Cita eliminada', 'success');
      setABorrar(null);
      loadCitas();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Citas</h1>
          <p>{citas.length} citas registradas · filtra por estado o fecha.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => { setSelectedCita(null); setModalOpen(true); }}>
          <IconPlus />
          Nueva cita
        </button>
      </div>

      <div className="toolbar">
        <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: 2 }}>
          {ESTADOS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn btn-sm ${filtro === t.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFiltro(t.id)}
              aria-pressed={filtro === t.id}
            >
              {t.label}
              <span style={{ opacity: 0.75 }}>{conteos[t.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2" style={{ marginLeft: 'auto' }}>
          <span className="form-label" style={{ marginBottom: 0 }}>Fecha</span>
          <input
            type="date"
            className="form-control num"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{ width: 160 }}
            aria-label="Filtrar citas por fecha"
          />
          {fecha && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFecha('')}>Limpiar</button>
          )}
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton" style={{ height: 168 }} />)}
        </div>
      ) : visibles.length === 0 ? (
        <div className="panel empty">
          <span className="empty-icon"><IconCalendar /></span>
          <div>
            <strong>No hay citas con este filtro</strong>
            <p>Cambia el estado o la fecha, o agenda una cita nueva.</p>
          </div>
          <button type="button" className="btn btn-outline" onClick={() => { setFiltro('todas'); setFecha(''); }}>
            Quitar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {visibles.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              onChangeEstado={handleChangeEstado}
              onEdit={(c) => { setSelectedCita(c); setModalOpen(true); }}
              onDelete={(id) => setABorrar({ id, nombre: cita.lead_nombre })}
            />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedCita ? 'Editar cita' : 'Nueva cita'}>
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
