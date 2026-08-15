import React from 'react';
import { Sun, CheckCircle2, Clock, AlertTriangle, Users, DollarSign, Zap } from 'lucide-react';
import { Proyecto, Material } from '../types/database';

interface MetricsProps {
  proyectos: Proyecto[];
  materiales: Material[];
}

export const MetricsCards: React.FC<MetricsProps> = ({ proyectos, materiales }) => {
  const totalCapacidad = proyectos.reduce((acc, p) => acc + Number(p.capacidad_kw), 0);
  const totalPresupuesto = proyectos.reduce((acc, p) => acc + Number(p.presupuesto), 0);
  const completados = proyectos.filter(p => p.estado === 'Completado').length;
  const enProgreso = proyectos.filter(p => p.estado === 'En Progreso').length;
  const pendientes = proyectos.filter(p => p.estado === 'Pendiente').length;
  const stockBajoCount = materiales.filter(m => m.stock < 20).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Capacity kW */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/50 transition-all">
        <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Capacidad Total Solar</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {totalCapacidad.toLocaleString('es-MX', { maximumFractionDigits: 1 })} <span className="text-amber-400 text-lg font-semibold">kWp</span>
            </h3>
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> En {proyectos.length} proyectos activos
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Sun className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Projects Status breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Estado de Proyectos</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">{proyectos.length}</span>
              <span className="text-xs text-slate-400">instalaciones</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> {completados}
              </span>
              <span className="flex items-center gap-1 text-sky-400 font-medium">
                <Clock className="w-3 h-3" /> {enProgreso}
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <AlertTriangle className="w-3 h-3" /> {pendientes}
              </span>
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Capital Budget */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-sky-500/50 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Inversión Gestionada</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              ${(totalPresupuesto / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-400">USD</span>
            </h3>
            <p className="text-xs text-sky-400 mt-2 font-medium">
              Promedio: ${(totalPresupuesto / (proyectos.length || 1)).toLocaleString('es-MX', { maximumFractionDigits: 0 })} / proy
            </p>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Inventory & Health Alert */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/50 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Inventario & Materiales</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {materiales.length} <span className="text-xs text-slate-400 font-normal">ítems</span>
            </h3>
            <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${stockBajoCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              <AlertTriangle className="w-3.5 h-3.5" /> {stockBajoCount} ítems en stock crítico
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
