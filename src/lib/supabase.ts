import { createClient } from '@supabase/supabase-js';
import { Proyecto, Instalador, Material } from '../types/database';

const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = envUrl || 'https://demo-ecoflow.supabase.co';
const supabaseAnonKey = envKey || 'demo-anon-key';

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);

export const IS_MOCK_MODE = !envUrl || envUrl.includes('demo-ecoflow');

// MOCK SEED DATA FOR DEMO & LOCAL DEVELOPMENT
export const INITIAL_INSTALADORES: Instalador[] = [
  {
    id: 'a1010101-1111-4111-8111-111111111111',
    nombre: 'Carlos Mendoza',
    email: 'carlos.mendoza@ecoflow.com',
    telefono: '+52 555 123 4567',
    especialidad: 'Inversores Centrales y Media Tensión',
    estado: 'activo'
  },
  {
    id: 'b2020202-2222-4222-8222-222222222222',
    nombre: 'Sofía Guerrero',
    email: 'sofia.guerrero@ecoflow.com',
    telefono: '+52 555 987 6543',
    especialidad: 'Sistemas Residenciales Microinversores',
    estado: 'activo'
  },
  {
    id: 'c3030303-3333-4333-8333-333333333333',
    nombre: 'Mateo Ramírez',
    email: 'mateo.ramirez@ecoflow.com',
    telefono: '+52 555 456 7890',
    especialidad: 'Estructuras de Montaje Industrial',
    estado: 'activo'
  }
];

export const INITIAL_PROYECTOS: Proyecto[] = [
  {
    id: 'p1111111-1111-4111-8111-111111111111',
    nombre: 'Parque Solar Industrial Querétaro',
    cliente_nombre: 'Grupo Logístico del Norte',
    cliente_email: 'contacto@grupologistico.com',
    ubicacion: 'Querétaro, QRO',
    capacidad_kw: 250.50,
    estado: 'En Progreso',
    instalador_id: 'a1010101-1111-4111-8111-111111111111',
    presupuesto: 185000.00,
    fecha_inicio: '2026-07-01',
    notas: 'Instalación de 450 paneles Jinko Solar 550W en techumbre metálica.',
    instalador: INITIAL_INSTALADORES[0]
  },
  {
    id: 'p2222222-2222-4222-8222-222222222222',
    nombre: 'Residencial San Ángel SunPower',
    cliente_nombre: 'Lic. Alejandro Moreno',
    cliente_email: 'a.moreno@gmail.com',
    ubicacion: 'CDMX, Álvaro Obregón',
    capacidad_kw: 12.80,
    estado: 'Completado',
    instalador_id: 'b2020202-2222-4222-8222-222222222222',
    presupuesto: 16500.00,
    fecha_inicio: '2026-06-15',
    fecha_fin: '2026-07-02',
    notas: 'Sistema interconectado CFE con 24 paneles y microinversores Enphase.',
    instalador: INITIAL_INSTALADORES[1]
  },
  {
    id: 'p3333333-3333-4333-8333-333333333333',
    nombre: 'Planta Embotelladora EcoBio',
    cliente_nombre: 'Bebidas Ecológicas de México',
    cliente_email: 'operaciones@ecobio.mx',
    ubicacion: 'Toluca, EdoMex',
    capacidad_kw: 500.00,
    estado: 'Pendiente',
    instalador_id: 'c3030303-3333-4333-8333-333333333333',
    presupuesto: 390000.00,
    fecha_inicio: '2026-08-20',
    notas: 'Esperando dictamen de la CRE y permiso de interconexión CFE.',
    instalador: INITIAL_INSTALADORES[2]
  },
  {
    id: 'p4444444-4444-4444-8444-444444444444',
    nombre: 'Rancho Agrícola Solar Híbrido',
    cliente_nombre: 'Agrícola Valle Solar S.A.',
    cliente_email: 'info@vallesolar.com',
    ubicacion: 'Celaya, GTO',
    capacidad_kw: 85.00,
    estado: 'En Progreso',
    instalador_id: 'a1010101-1111-4111-8111-111111111111',
    presupuesto: 78000.00,
    fecha_inicio: '2026-07-25',
    notas: 'Sistema aislado Off-Grid con banco de baterías de litio LFP.',
    instalador: INITIAL_INSTALADORES[0]
  }
];

export const INITIAL_MATERIALES: Material[] = [
  {
    id: 'm1',
    nombre: 'Panel Solar Jinko 550W Monocristalino',
    categoria: 'Panel',
    stock: 180,
    unidad: 'unidades',
    precio_unitario: 195.00,
    proyecto_id: 'p1111111-1111-4111-8111-111111111111'
  },
  {
    id: 'm2',
    nombre: 'Inversor Central Fronius Symo 20kW',
    categoria: 'Inversor',
    stock: 12,
    unidad: 'unidades',
    precio_unitario: 2850.00,
    proyecto_id: 'p1111111-1111-4111-8111-111111111111'
  },
  {
    id: 'm3',
    nombre: 'Microinversor Enphase IQ8+',
    categoria: 'Inversor',
    stock: 65,
    unidad: 'unidades',
    precio_unitario: 185.00,
    proyecto_id: 'p2222222-2222-4222-8222-222222222222'
  },
  {
    id: 'm4',
    nombre: 'Estructura Racking Aluminio Anodizado K2',
    categoria: 'Estructura',
    stock: 320,
    unidad: 'metros',
    precio_unitario: 45.00
  },
  {
    id: 'm5',
    nombre: 'Cable Solar Fotovoltaico 6mm² Rojo/Negro',
    categoria: 'Cableado',
    stock: 1500,
    unidad: 'metros',
    precio_unitario: 2.80
  },
  {
    id: 'm6',
    nombre: 'Batería Litio LFP Tesla Powerwall 2',
    categoria: 'Batería',
    stock: 8,
    unidad: 'unidades',
    precio_unitario: 7500.00,
    proyecto_id: 'p4444444-4444-4444-8444-444444444444'
  }
];
