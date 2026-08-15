import React, { useState } from 'react';
import { Proyecto, EstadoProyecto } from '../types/database';
import { Search, MapPin, Zap, User, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProjectListProps {
  proyectos: Proyecto[];
  onStatusChange: (id: string, nuevoEstado: EstadoProyecto) => void;
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  proyectos,
  onStatusChange,
  onSelectProyecto
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredProyectos = proyectos.filter(p => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || p.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (estado: EstadoProyecto) => {
    switch (estado) {
      case 'Completado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completado
          </span>
        );
      case 'En Progreso':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-xs font-semibold animate-pulse">
            <Clock className="w-3.5 h-3.5" /> En Progreso
          </span>
        );
      case 'Pendiente':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Table Top Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Proyectos Fotovoltaicos ({filteredProyectos.length})
          </h2>
          <p className="text-xs text-slate-400">Listado interactivo conectado con políticas RLS de Supabase</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar proyecto o cliente..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
            {['todos', 'Pendiente', 'En Progreso', 'Completado'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/40">
              <th className="py-3.5 px-4 rounded-l-xl">Proyecto / Cliente</th>
              <th className="py-3.5 px-4">Capacidad</th>
              <th className="py-3.5 px-4">Instalador Asignado</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4">Presupuesto</th>
              <th className="py-3.5 px-4 text-right rounded-r-xl">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredProyectos.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500 text-sm">
                  No se encontraron proyectos solares con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredProyectos.map(p => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectProyecto(p)}
                >
                  {/* Nombre & Cliente */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {p.nombre}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="text-slate-300 font-medium">{p.cliente_nombre}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {p.ubicacion}
                      </span>
                    </div>
                  </td>

                  {/* Capacidad kW */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      {p.capacidad_kw} kWp
                    </div>
                  </td>

                  {/* Instalador */}
                  <td className="py-4 px-4">
                    <div className="text-xs text-slate-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>{p.instalador?.nombre || 'Sin Asignar'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                      {p.instalador?.especialidad}
                    </div>
                  </td>

                  {/* Estado Badge */}
                  <td className="py-4 px-4">{getStatusBadge(p.estado)}</td>

                  {/* Presupuesto */}
                  <td className="py-4 px-4 font-semibold text-slate-200">
                    ${p.presupuesto.toLocaleString('es-MX')} USD
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <select
                      value={p.estado}
                      onChange={e => onStatusChange(p.id, e.target.value as EstadoProyecto)}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-amber-500 hover:border-slate-700 transition-colors"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Completado">Completado</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
