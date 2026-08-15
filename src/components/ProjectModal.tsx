import React, { useState } from 'react';
import { Proyecto, NuevoProyectoForm, Instalador } from '../types/database';
import { X, Plus, Zap, UserCheck, MapPin, DollarSign, FileText, AlertCircle } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NuevoProyectoForm) => Promise<void>;
  instaladores: Instalador[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  instaladores
}) => {
  const [formData, setFormData] = useState<NuevoProyectoForm>({
    nombre: '',
    cliente_nombre: '',
    cliente_email: '',
    ubicacion: '',
    capacidad_kw: 15.0,
    presupuesto: 25000,
    instalador_id: instaladores[0]?.id || '',
    notas: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del proyecto es obligatorio.';
    if (!formData.cliente_nombre.trim()) newErrors.cliente_nombre = 'El nombre del cliente es obligatorio.';
    if (!formData.cliente_email.includes('@')) newErrors.cliente_email = 'Ingrese un correo electrónico válido.';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación de la obra es obligatoria.';
    if (formData.capacidad_kw <= 0) newErrors.capacidad_kw = 'La capacidad kW debe ser mayor a 0.';
    if (formData.presupuesto <= 0) newErrors.presupuesto = 'El presupuesto debe ser un monto positivo.';
    if (!formData.instalador_id) newErrors.instalador_id = 'Debe asignar un instalador líder.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
      // Reset form
      setFormData({
        nombre: '',
        cliente_nombre: '',
        cliente_email: '',
        ubicacion: '',
        capacidad_kw: 15.0,
        presupuesto: 25000,
        instalador_id: instaladores[0]?.id || '',
        notas: ''
      });
    } catch (err: any) {
      setErrors({ global: err.message || 'Error al conectar con Supabase.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nuevo Proyecto Solar</h2>
              <p className="text-xs text-slate-400">Especificación técnica y asignación en Supabase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errors.global && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errors.global}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre Proyecto */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Proyecto *</label>
              <input
                type="text"
                placeholder="Ej. Solar Park Chihuahua phase 1"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${errors.nombre ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors`}
              />
              {errors.nombre && <p className="text-xs text-rose-400 mt-1">{errors.nombre}</p>}
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Ubicación / Ciudad *
              </label>
              <input
                type="text"
                placeholder="Ej. Monterrey, Nuevo León"
                value={formData.ubicacion}
                onChange={e => setFormData({ ...formData, ubicacion: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${errors.ubicacion ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors`}
              />
              {errors.ubicacion && <p className="text-xs text-rose-400 mt-1">{errors.ubicacion}</p>}
            </div>

            {/* Cliente Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente / Empresa *</label>
              <input
                type="text"
                placeholder="Ej. Industrias del Norte S.A."
                value={formData.cliente_nombre}
                onChange={e => setFormData({ ...formData, cliente_nombre: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${errors.cliente_nombre ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors`}
              />
              {errors.cliente_nombre && <p className="text-xs text-rose-400 mt-1">{errors.cliente_nombre}</p>}
            </div>

            {/* Cliente Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico Cliente *</label>
              <input
                type="email"
                placeholder="contacto@cliente.com"
                value={formData.cliente_email}
                onChange={e => setFormData({ ...formData, cliente_email: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${errors.cliente_email ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors`}
              />
              {errors.cliente_email && <p className="text-xs text-rose-400 mt-1">{errors.cliente_email}</p>}
            </div>

            {/* Capacidad kW */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Capacidad Instalada (kWp) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.capacidad_kw}
                onChange={e => setFormData({ ...formData, capacidad_kw: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${errors.capacidad_kw ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors`}
              />
              {errors.capacidad_kw && <p className="text-xs text-rose-400 mt-1">{errors.capacidad_kw}</p>}
            </div>

            {/* Presupuesto */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Presupuesto Estimado ($ USD) *
              </label>
              <input
                type="number"
                step="500"
                min="100"
                value={formData.presupuesto}
                onChange={e => setFormData({ ...formData, presupuesto: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${errors.presupuesto ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors`}
              />
              {errors.presupuesto && <p className="text-xs text-rose-400 mt-1">{errors.presupuesto}</p>}
            </div>
          </div>

          {/* Instalador Asignado */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-sky-400" /> Instalador Líder Asignado (Sujeto a RLS) *
            </label>
            <select
              value={formData.instalador_id}
              onChange={e => setFormData({ ...formData, instalador_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="">-- Seleccionar Instalador --</option>
              {instaladores.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.nombre} ({inst.especialidad})
                </option>
              ))}
            </select>
            {errors.instalador_id && <p className="text-xs text-rose-400 mt-1">{errors.instalador_id}</p>}
          </div>

          {/* Notas de Ingeniería */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Especificaciones de Ingeniería / Notas
            </label>
            <textarea
              rows={3}
              placeholder="Describa tipo de inversores, marca de paneles o permisos requeridos..."
              value={formData.notas}
              onChange={e => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>Guardando en Supabase...</>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Crear Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
