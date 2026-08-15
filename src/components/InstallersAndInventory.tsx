import React from 'react';
import { Instalador, Material } from '../types/database';
import { UserCheck, ShieldAlert, PackageCheck, AlertTriangle, Layers } from 'lucide-react';

interface InstallersAndInventoryProps {
  instaladores: Instalador[];
  materiales: Material[];
}

export const InstallersAndInventory: React.FC<InstallersAndInventoryProps> = ({
  instaladores,
  materiales
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Installers RLS Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Directorio de Instaladores</h3>
              <p className="text-xs text-slate-400">Identidades autenticadas vinculadas a políticas RLS</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-sky-500/10 text-sky-400 text-xs font-semibold rounded-full border border-sky-500/20">
            {instaladores.length} Activos
          </span>
        </div>

        <div className="space-y-3">
          {instaladores.map(inst => (
            <div
              key={inst.id}
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{inst.nombre}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{inst.email}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-medium text-slate-300">
                    {inst.especialidad}
                  </span>
                  <span>•</span>
                  <span>{inst.telefono}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  <ShieldAlert className="w-3 h-3" /> RLS Verified
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">ID: {inst.id.substring(0, 8)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Materials & Stock Inventory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Inventario de Materiales Solares</h3>
              <p className="text-xs text-slate-400">Paneles, inversores, cableado y almacenamiento</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/20">
            {materiales.reduce((acc, m) => acc + m.stock, 0)} unidades
          </span>
        </div>

        <div className="space-y-3">
          {materiales.map(mat => {
            const isLowStock = mat.stock < 20;
            return (
              <div
                key={mat.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    {mat.nombre}
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded">
                      {mat.categoria}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Precio unitario: <span className="text-slate-200 font-semibold">${mat.precio_unitario.toLocaleString('es-MX')} USD</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm flex items-center justify-end gap-1.5 ${isLowStock ? 'text-rose-400' : 'text-slate-100'}`}>
                    {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
                    {mat.stock} {mat.unidad}
                  </div>
                  <p className={`text-[10px] mt-0.5 ${isLowStock ? 'text-rose-400 font-semibold' : 'text-slate-500'}`}>
                    {isLowStock ? 'Stock Crítico' : 'Stock Normal'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
