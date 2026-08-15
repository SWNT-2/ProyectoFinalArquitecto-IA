import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Cpu, Code2, Database, Copy, Check, Terminal } from 'lucide-react';

export const ArchitectureDocViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'prompt' | 'rls' | 'caso'>('prompt');

  const masterPrompt = `[PROMPT MAESTRO SDD - PLATAFORMA ECOFLOW]
Rol: Arquitecto de Software Principal experto en React, TypeScript y Supabase PostgreSQL.
Objetivo: Diseñar e implementar el sistema de gestión de proyectos de energía solar EcoFlow.

RESTRICCIONES Y REQUISITOS TÉCNICOS:
1. Base de Datos Supabase:
   - Tablas: proyectos, instaladores, materiales.
   - Seguridad por Diseño: Row Level Security (RLS) activo donde los instaladores solo consultan/actualizan proyectos donde instalador_id = auth.uid().
2. Frontend React:
   - Atomicidad de componentes, Hooks tipados, manejo de estado reactivo y filtrado en tiempo real.
   - Validación estricta de formularios antes de llamadas a Supabase.
3. Formato de Salida:
   - Código limpio, modular, sin placeholders y con tipos de TypeScript explícitos.`;

  const sqlRLS = `-- POLÍTICA RLS DESTACADA (PROYECTOS POR INSTALADOR)
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instaladores pueden ver sus proyectos asignados"
ON public.proyectos
FOR SELECT
USING (
    auth.role() = 'authenticated' AND (
        instalador_id = auth.uid() 
        OR auth.jwt() ->> 'email' IN (
            SELECT email FROM public.instaladores WHERE id = proyectos.instalador_id
        )
    )
);`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Especificación Técnica & Flujo de IA</h2>
            <p className="text-xs text-slate-400">Documento de Arquitectura para la Evaluación Final del Arquitecto IA</p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveSection('prompt')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeSection === 'prompt' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Prompt Maestro SDD
          </button>
          <button
            onClick={() => setActiveSection('rls')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeSection === 'rls' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> RLS Supabase
          </button>
          <button
            onClick={() => setActiveSection('caso')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeSection === 'caso' ? 'bg-slate-800 text-sky-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Caso de Estudio IA
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeSection === 'prompt' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" /> Documento de Especificación Técnica (Specification-Driven Development)
            </h3>
            <button
              onClick={() => copyToClipboard(masterPrompt)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar Prompt'}
            </button>
          </div>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {masterPrompt}
          </pre>
        </div>
      )}

      {activeSection === 'rls' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Configuración de Row Level Security (RLS) en Supabase
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Para garantizar la soberanía y seguridad de los datos, configuramos una regla en PostgreSQL que intercepta las peticiones directamente en el motor de la base de datos. Ningún instalador puede ver o modificar proyectos que no le pertenecen.
          </p>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
            {sqlRLS}
          </pre>
        </div>
      )}

      {activeSection === 'caso' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" /> Resolución de Problema Técnico Complejo con IA
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-3 text-slate-300 leading-relaxed">
            <p className="font-semibold text-amber-400">Escenario Desafiante:</p>
            <p>
              Durante el desarrollo, surgió un problema con las políticas de RLS en Supabase cuando un instalador iniciaba sesión sin una relación directa entre su ID de `auth.users` y la tabla `instaladores`.
            </p>
            <p className="font-semibold text-sky-400">Solución Estratégica con IA:</p>
            <p>
              En lugar de deshabilitar la seguridad o escribir hacks en el cliente React, utilizamos un prompt de refinamiento iterativo para solicitar a la IA una política RLS compuesta usando <code>auth.jwt() -&gt;&gt; 'email'</code>. Esto permitió emparejar dinámicamente la identidad sin romper la integridad referencial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
