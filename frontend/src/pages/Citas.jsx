import React, { useEffect, useState } from 'react';
import { CitaCard } from '../components/CitaCard';
import { CitaForm } from '../components/CitaForm';
import { Modal } from '../components/Modal';
import { api } from '../api/client';
import { useToast } from '../components/Toast';

export const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  
  const { addToast } = useToast();

  const loadCitas = async () => {
    try {
      setLoading(true);
      const data = await api.getCitas();
      setCitas(data);
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  const handleSaveCita = async (data) => {
    try {
      if (selectedCita) {
        await api.updateCita(selectedCita.id, data);
        addToast('Cita actualizada correctamente', 'success');
      } else {
        await api.createCita(data);
        addToast('Cita creada correctamente', 'success');
      }
      setIsModalOpen(false);
      loadCitas();
    } catch (error) {
      addToast(error.message, 'error');
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

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta cita?')) return;
    try {
      await api.deleteCita(id);
      addToast('Cita eliminada', 'success');
      loadCitas();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const openEdit = (cita) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setSelectedCita(null);
    setIsModalOpen(true);
  };

  const filteredCitas = citas.filter(c => {
    if (filter === 'todas') return true;
    return (c.estado || 'pendiente').toLowerCase() === filter;
  });

  const tabs = [
    { id: 'todas', label: 'Todas' },
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'confirmada', label: 'Confirmadas' },
    { id: 'cancelada', label: 'Canceladas' },
    { id: 'reprogramada', label: 'Reprogramadas' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Citas</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + Nueva Cita
        </button>
      </div>

      <div className="flex gap-2 mb-6" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`btn ${filter === t.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: '200px' }}></div>)}
        </div>
      ) : (
        filteredCitas.length === 0 ? (
          <div className="glass p-8 text-center text-secondary">
            No se encontraron citas para este filtro.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCitas.map(cita => (
              <CitaCard 
                key={cita.id} 
                cita={cita}
                onChangeEstado={handleChangeEstado}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedCita ? 'Editar Cita' : 'Nueva Cita'}
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
