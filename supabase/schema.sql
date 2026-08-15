-- ==========================================
-- ECOFLOW - ESQUEMA DE BASE DE DATOS SUPABASE
-- Plataforma de Gestión de Energías Renovables
-- ==========================================

-- 1. CREACIÓN DE TABLAS

-- Tabla: Instaladores
CREATE TABLE IF NOT EXISTS public.instaladores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    especialidad TEXT DEFAULT 'Fotovoltaico Residencial',
    estado TEXT CHECK (estado IN ('activo', 'inactivo')) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Proyectos Solares
CREATE TABLE IF NOT EXISTS public.proyectos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_email TEXT NOT NULL,
    ubicacion TEXT NOT NULL,
    capacidad_kw NUMERIC(10, 2) NOT NULL CHECK (capacidad_kw > 0),
    estado TEXT CHECK (estado IN ('Pendiente', 'En Progreso', 'Completado')) DEFAULT 'Pendiente',
    instalador_id UUID REFERENCES public.instaladores(id) ON DELETE SET NULL,
    presupuesto NUMERIC(12, 2) NOT NULL CHECK (presupuesto >= 0),
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Materiales / Inventario
CREATE TABLE IF NOT EXISTS public.materiales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    categoria TEXT CHECK (categoria IN ('Panel', 'Inversor', 'Estructura', 'Cableado', 'Batería', 'Protección')) NOT NULL,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    unidad TEXT DEFAULT 'unidades',
    precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    proyecto_id UUID REFERENCES public.proyectos(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON public.proyectos(estado);
CREATE INDEX IF NOT EXISTS idx_proyectos_instalador ON public.proyectos(instalador_id);
CREATE INDEX IF NOT EXISTS idx_materiales_categoria ON public.materiales(categoria);

-- 3. SEGURIDAD DE NIVEL DE FILA (ROW LEVEL SECURITY - RLS)

-- Habilitar RLS en cada tabla
ALTER TABLE public.instaladores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiales ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS PARA PROYECTOS:
-- Los instaladores autenticados solo pueden ver los proyectos que les han sido asignados explícitamente.
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
);

-- Los administradores/managers tienen acceso total para insertar y modificar proyectos.
CREATE POLICY "Admins pueden gestionar todos los proyectos"
ON public.proyectos
FOR ALL
USING (
    auth.role() = 'authenticated'
);

-- POLÍTICAS PARA INSTALADORES Y MATERIALES (Lectura general para usuarios autenticados)
CREATE POLICY "Lectura de instaladores para autenticados"
ON public.instaladores FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Lectura de inventario para autenticados"
ON public.materiales FOR SELECT USING (auth.role() = 'authenticated');


-- 4. DATOS INICIALES DE DEMOSTRACIÓN (SEED DATA)

INSERT INTO public.instaladores (id, nombre, email, telefono, especialidad, estado) VALUES
('a1010101-1111-4111-8111-111111111111', 'Carlos Mendoza', 'carlos.mendoza@ecoflow.com', '+52 555 123 4567', 'Inversores Centrales y Media Tensión', 'activo'),
('b2020202-2222-4222-8222-222222222222', 'Sofía Guerrero', 'sofia.guerrero@ecoflow.com', '+52 555 987 6543', 'Sistemas Residenciales Microinversores', 'activo'),
('c3030303-3333-4333-8333-333333333333', 'Mateo Ramírez', 'mateo.ramirez@ecoflow.com', '+52 555 456 7890', 'Estructuras de Montaje Industrial', 'activo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.proyectos (id, nombre, cliente_nombre, cliente_email, ubicacion, capacidad_kw, estado, instalador_id, presupuesto, fecha_inicio, notas) VALUES
('p1111111-1111-4111-8111-111111111111', 'Parque Solar Industrial Querétaro', 'Grupo Logístico del Norte', 'contacto@grupologistico.com', 'Querétaro, QRO', 250.50, 'En Progreso', 'a1010101-1111-4111-8111-111111111111', 185000.00, '2026-07-01', 'Instalación de 450 paneles Jinko Solar 550W en techumbre metálica.'),
('p2222222-2222-4222-8222-222222222222', 'Residencial San Ángel SunPower', 'Lic. Alejandro Moreno', 'a.moreno@gmail.com', 'CDMX, Álvaro Obregón', 12.80, 'Completado', 'b2020202-2222-4222-8222-222222222222', 16500.00, '2026-06-15', 'Sistema interconectado CFE con 24 paneles y microinversores Enphase.'),
('p3333333-3333-4333-8333-333333333333', 'Planta Embotelladora EcoBio', 'Bebidas Ecológicas de México', 'operaciones@ecobio.mx', 'Toluca, EdoMex', 500.00, 'Pendiente', 'c3030303-3333-4333-8333-333333333333', 390000.00, '2026-08-20', 'Esperando dictamen de la CRE y permiso de interconexión CFE.'),
('p4444444-4444-4444-8444-444444444444', 'Rancho Agrícola Solar Híbrido', 'Agrícola Valle Solar S.A.', 'info@vallesolar.com', 'Celaya, GTO', 85.00, 'En Progreso', 'a1010101-1111-4111-8111-111111111111', 78000.00, '2026-07-25', 'Sistema aislado Off-Grid con banco de baterías de litio LFP.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.materiales (nombre, categoria, stock, unidad, precio_unitario, proyecto_id) VALUES
('Panel Solar Jinko 550W Monocristalino', 'Panel', 180, 'unidades', 195.00, 'p1111111-1111-4111-8111-111111111111'),
('Inversor Central Fronius Symo 20kW', 'Inversor', 12, 'unidades', 2850.00, 'p1111111-1111-4111-8111-111111111111'),
('Microinversor Enphase IQ8+', 'Inversor', 65, 'unidades', 185.00, 'p2222222-2222-4222-8222-222222222222'),
('Estructura Racking Aluminio Anodizado K2', 'Estructura', 320, 'metros', 45.00, NULL),
('Cable Solar Fotovoltaico 6mm² Rojo/Negro', 'Cableado', 1500, 'metros', 2.80, NULL),
('Batería Litio LFP Tesla Powerwall 2', 'Batería', 8, 'unidades', 7500.00, 'p4444444-4444-4444-8444-444444444444')
ON CONFLICT DO NOTHING;
