import React, { useState, useEffect } from 'react';
import {
  Sun,
  Plus,
  LayoutDashboard,
  Users,
  Layers,
  BookOpen,
  Database,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Proyecto, Instalador, Material, NuevoProyectoForm, EstadoProyecto } from './types/database';
import {
  supabase,
  IS_MOCK_MODE,
  INITIAL_PROYECTOS,
  INITIAL_INSTALADORES,
  INITIAL_MATERIALES
} from './lib/supabase';
import { MetricsCards } from './components/MetricsCards';
import { ProjectList } from './components/ProjectList';
import { ProjectModal } from './components/ProjectModal';
import { InstallersAndInventory } from './components/InstallersAndInventory';
import { ArchitectureDocViewer } from './components/ArchitectureDocViewer';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'instaladores' | 'arquitectura'>('dashboard');
  const [proyectos, setProyectos] = useState<Proyecto[]>(INITIAL_PROYECTOS);
  const [instaladores, setInstaladores] = useState<Instalador[]>(INITIAL_INSTALADORES);
  const [materiales, setMateriales] = useState<Material[]>(INITIAL_MATERIALES);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Carga inicial desde Supabase o Mock
  useEffect(() => {
    async function loadData() {
      if (IS_MOCK_MODE) return;
      try {
        setLoading(true);
        const [resProyectos, resInstaladores, resMateriales] = await Promise.all([
          supabase.from('proyectos').select('*, instalador:instaladores(*)').order('created_at', { ascending: false }),
          supabase.from('instaladores').select('*'),
          supabase.from('materiales').select('*')
        ]);

        if (resProyectos.data && resProyectos.data.length > 0) {
          setProyectos(resProyectos.data as any);
        }
        if (resInstaladores.data && resInstaladores.data.length > 0) {
          setInstaladores(resInstaladores.data as any);
        }
        if (resMateriales.data && resMateriales.data.length > 0) {
          setMateriales(resMateriales.data as any);
        }
      } catch (err) {
        console.warn('Usando datos de demostración reactivos.', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Crear nuevo proyecto en Supabase / Mock State
  const handleSaveProyecto = async (formData: NuevoProyectoForm) => {
    const instaladorEncontrado = instaladores.find(i => i.id === formData.instalador_id);
    
    if (!IS_MOCK_MODE) {
      const { data, error } = await supabase.from('proyectos').insert([
        {
          nombre: formData.nombre,
          cliente_nombre: formData.cliente_nombre,
          cliente_email: formData.cliente_email,
          ubicacion: formData.ubicacion,
          capacidad_kw: formData.capacidad_kw,
          presupuesto: formData.presupuesto,
          instalador_id: formData.instalador_id,
          notas: formData.notas,
          estado: 'Pendiente'
        }
      ]).select('*, instalador:instaladores(*)');

      if (error) throw new Error(error.message);
      if (data && data[0]) {
        setProyectos([data[0] as any, ...proyectos]);
      }
    } else {
      // Mock update
      const nuevoProy: Proyecto = {
        id: `p-${Date.now()}`,
        nombre: formData.nombre,
        cliente_nombre: formData.cliente_nombre,
        cliente_email: formData.cliente_email,
        ubicacion: formData.ubicacion,
        capacidad_kw: formData.capacidad_kw,
        presupuesto: formData.presupuesto,
        estado: 'Pendiente',
        instalador_id: formData.instalador_id,
        fecha_inicio: new Date().toISOString().split('T')[0],
        notas: formData.notas,
        instalador: instaladorEncontrado
      };
      setProyectos([nuevoProy, ...proyectos]);
    }

    showToast('success', `Proyecto "${formData.nombre}" creado exitosamente en Supabase.`);
  };

  // Cambiar estado de un proyecto
  const handleStatusChange = async (id: string, nuevoEstado: EstadoProyecto) => {
    if (!IS_MOCK_MODE) {
      await supabase.from('proyectos').update({ estado: nuevoEstado }).eq('id', id);
    }
    setProyectos(prev =>
      prev.map(p => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
    showToast('success', `Estado de proyecto actualizado a "${nuevoEstado}".`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 rounded-xl font-extrabold shadow-lg shadow-amber-500/20">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">EcoFlow</h1>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-md border border-amber-500/20 uppercase tracking-widest">
                  Arquitecto IA
                </span>
              </div>
              <p className="text-xs text-slate-400">Plataforma de Gestión de Energías Renovables</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">
                {IS_MOCK_MODE ? 'Modo Demo (Supabase Ready)' : 'Supabase Conectado'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Nuevo Proyecto
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-amber-400 border border-slate-800 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard Solares
          </button>
          <button
            onClick={() => setActiveTab('instaladores')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'instaladores'
                ? 'bg-slate-900 text-amber-400 border border-slate-800 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Instaladores & Inventario
          </button>
          <button
            onClick={() => setActiveTab('arquitectura')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'arquitectura'
                ? 'bg-slate-900 text-amber-400 border border-slate-800 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Especificación & RLS
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <MetricsCards proyectos={proyectos} materiales={materiales} />
            <ProjectList
              proyectos={proyectos}
              onStatusChange={handleStatusChange}
              onSelectProyecto={p => setSelectedProyecto(p)}
            />
          </div>
        )}

        {activeTab === 'instaladores' && (
          <InstallersAndInventory instaladores={instaladores} materiales={materiales} />
        )}

        {activeTab === 'arquitectura' && <ArchitectureDocViewer />}
      </main>

      {/* Modal detail drawer */}
      {selectedProyecto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{selectedProyecto.nombre}</h3>
              <button onClick={() => setSelectedProyecto(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><span className="text-slate-400">Cliente:</span> {selectedProyecto.cliente_nombre} ({selectedProyecto.cliente_email})</p>
              <p><span className="text-slate-400">Ubicación:</span> {selectedProyecto.ubicacion}</p>
              <p><span className="text-slate-400">Capacidad kW:</span> <strong className="text-amber-400">{selectedProyecto.capacidad_kw} kWp</strong></p>
              <p><span className="text-slate-400">Presupuesto:</span> ${selectedProyecto.presupuesto.toLocaleString('es-MX')} USD</p>
              <p><span className="text-slate-400">Instalador Asignado:</span> {selectedProyecto.instalador?.nombre || 'Sin asignar'}</p>
              <p><span className="text-slate-400">Notas de obra:</span> {selectedProyecto.notas || 'Sin notas registradas.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal Wizard */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProyecto}
        instaladores={instaladores}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        EcoFlow Solar Architecture Platform • Entregable Final del Curso "El Arquitecto IA" (React + Supabase RLS)
      </footer>
    </div>
  );
}
export default App;
