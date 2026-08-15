// Tipos de TypeScript generados para el esquema de la base de datos de EcoFlow

export type EstadoProyecto = 'Pendiente' | 'En Progreso' | 'Completado';
export type EstadoInstalador = 'activo' | 'inactivo';
export type CategoriaMaterial = 'Panel' | 'Inversor' | 'Estructura' | 'Cableado' | 'Batería' | 'Protección';

export interface Instalador {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  especialidad: string;
  estado: EstadoInstalador;
  created_at?: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  cliente_nombre: string;
  cliente_email: string;
  ubicacion: string;
  capacidad_kw: number;
  estado: EstadoProyecto;
  instalador_id: string | null;
  presupuesto: number;
  fecha_inicio: string;
  fecha_fin?: string | null;
  notas?: string | null;
  created_at?: string;
  // Relación populada opcional
  instalador?: Instalador;
}

export interface Material {
  id: string;
  nombre: string;
  categoria: CategoriaMaterial;
  stock: number;
  unidad: string;
  precio_unitario: number;
  proyecto_id?: string | null;
  created_at?: string;
}

export interface NuevoProyectoForm {
  nombre: string;
  cliente_nombre: string;
  cliente_email: string;
  ubicacion: string;
  capacidad_kw: number;
  presupuesto: number;
  instalador_id: string;
  notas: string;
}

export interface Database {
  public: {
    Tables: {
      instaladores: {
        Row: Instalador;
        Insert: Omit<Instalador, 'id' | 'created_at'>;
        Update: Partial<Omit<Instalador, 'id' | 'created_at'>>;
      };
      proyectos: {
        Row: Proyecto;
        Insert: Omit<Proyecto, 'id' | 'created_at'>;
        Update: Partial<Omit<Proyecto, 'id' | 'created_at'>>;
      };
      materiales: {
        Row: Material;
        Insert: Omit<Material, 'id' | 'created_at'>;
        Update: Partial<Omit<Material, 'id' | 'created_at'>>;
      };
    };
  };
}
