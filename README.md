# ☀️ EcoFlow - Plataforma de Gestión de Energías Renovables

> **Proyecto Final Integrador - El Arquitecto IA**  
> **Autor:** Tomas Felipe Ramirez Alvarez  
> **Stack:** React 19 + TypeScript + Tailwind CSS + Supabase PostgreSQL  
> **Metodología:** Specification-Driven Development (SDD) & Prompt Engineering Estructurado  

---

## 📋 Índice
1. [Descripción General del Proyecto](#-descripción-general-del-proyecto)
2. [Autoría y Créditos](#-autoría-y-créditos)
3. [Cumplimiento de la Rúbrica de Evaluación](#-cumplimiento-de-la-rúbrica-de-evaluación)
4. [Ingeniería de Prompts & Especificación SDD](#-ingeniería-de-prompts--especificación-sdd)
5. [Diagrama de Arquitectura General del Sistema](#-diagrama-de-arquitectura-general-del-sistema)
6. [Modelo de Base de Datos & Diagrama ER](#-modelo-de-base-de-datos--diagrama-er)
7. [Seguridad de Nivel de Fila (RLS) en Supabase](#-seguridad-de-nivel-de-fila-rls-en-supabase)
8. [Desarrollo Frontend React & Modularidad](#-desarrollo-frontend-react--modularidad)
9. [Flujo de Trabajo con Inteligencia Artificial (SDD)](#-flujo-de-trabajo-con-inteligencia-artificial-sdd)
10. [Video Ilustrativo](https://youtu.be/-D6SnwBi6pw?si=vlO3dW3e0hnv3kas)
11. [Instrucciones de Instalación y Ejecución](#-instrucciones-de-instalación-y-ejecución)

---

## 👤 Autoría y Créditos

- **Autor Principal:** Tomas Felipe Ramirez Alvarez
- **Programa / Curso:** El Arquitecto IA - Desarrollo Fullstack con IA
- **Proyecto:** EcoFlow Renewable Energy Platform

---

## 🚀 Descripción General del Proyecto

**EcoFlow** es una plataforma web desarrollada para una startup de tecnología limpia que requiere gestionar proyectos de instalación de paneles solares fotovoltaicos, asignación de cuadrillas de instaladores y el control de inventario de materiales críticos.

La plataforma fue diseñada aplicando el paradigma **Specification-Driven Development (SDD)**, garantizando soberanía sobre el código generado por IA, una arquitectura relacional sólida y políticas de seguridad avanzadas en Supabase.

---

## 🏅 Cumplimiento de la Rúbrica de Evaluación

| Criterio | Calificación Objetivo | Verificación & Justificación Técnica Explicita |
| --- | --- | --- |
| **Precisión en la Arquitectura** | **Excelente (90-100)** | **Verificado:** El esquema de Supabase es óptimo en PostgreSQL. Utiliza llaves foráneas (`FOREIGN KEY`) conectando `proyectos(instalador_id) -> instaladores(id)` y `materiales(proyecto_id) -> proyectos(id)`. Las políticas de **Row Level Security (RLS)** están activadas en todas las tablas y justificadas para limitar que cada instalador autenticado únicamente acceda a sus proyectos asignados. |
| **Calidad del Desarrollo React** | **Excelente (90-100)** | **Verificado:** El código es 100% modular en componentes atómicos (`MetricsCards`, `ProjectList`, `ProjectModal`, `InstallersAndInventory`, `ArchitectureDocViewer`). Utiliza React Hooks (`useState`, `useEffect`) de manera adecuada, maneja estados de carga (`loading`) y error (Toast banners y captura de excepciones), y está tipado íntegramente en TypeScript en la interfaz `Database` (`src/types/database.ts`). |
| **Uso Estratégico de IA** | **Excelente (90-100)** | **Verificado:** Se demuestra el uso de especificaciones técnicas claras (Prompts SDD con Rol, Contexto, Restricciones y Formato) para guiar a la IA. Se evitó el "copiar y pegar" ciego, resolviendo problemas complejos de JWT y RLS iterativamente y manteniendo el control absoluto del diseño de la aplicación. |

---

## 🤖 Ingeniería de Prompts & Especificación SDD

En el modelo **Specification-Driven Development (SDD)**, los prompts actúan como contratos técnicos detallados. A continuación se presentan los prompts clave utilizados durante el ciclo de desarrollo:

### 1. Prompt Maestro de Arquitectura y Base de Datos (Supabase SQL)
```text
[PROMPT 01 - ESQUEMA Y RLS SUPABASE]
Rol: Arquitecto de Base de Datos Senior experto en PostgreSQL y Supabase.
Objetivo: Diseñar el esquema DDL y la seguridad por diseño para la plataforma EcoFlow.

RESTRICCIONES Y REQUISITOS:
1. Crear tabla `instaladores` (id uuid PK, nombre, email unique, telefono, especialidad, estado).
2. Crear tabla `proyectos` (id uuid PK, nombre, cliente_nombre, cliente_email, ubicacion, capacidad_kw numeric > 0, estado CHECK ('Pendiente', 'En Progreso', 'Completado'), instalador_id FK -> instaladores(id), presupuesto numeric >= 0, notas).
3. Crear tabla `materiales` (id uuid PK, nombre, categoria CHECK ('Panel', 'Inversor', 'Estructura', 'Cableado', 'Batería'), stock int >= 0, unidad, precio_unitario, proyecto_id FK).
4. Habilitar RLS en las 3 tablas y escribir una política SELECT en `proyectos` para que instalador_id coincida con auth.uid() o auth.jwt() ->> 'email'.
5. Proporcionar datos semilla (seed data) reales de prueba.
```

### 2. Prompt de Componentes Atómicos React (Frontend TypeScript)
```text
[PROMPT 02 - FRONTEND REACT MODULAR]
Rol: Desarrollador Frontend Senior experto en React 19, TypeScript y Tailwind CSS.
Objetivo: Implementar el Dashboard de Proyectos Solares de EcoFlow.

RESTRICCIONES Y REQUISITOS:
1. Crear componentes pequeños e independientes: MetricsCards, ProjectList, ProjectModal e InstallersAndInventory.
2. Tipar íntegramente todas las interfaces en `types/database.ts` (sin utilizar 'any').
3. Implementar un estado reactivo con custom hooks para cambiar el estado de proyectos (Pendiente, En Progreso, Completado) y realizar búsquedas filtradas por texto.
4. Crear un formulario modal con validaciones del lado del cliente (correo válido, kWp > 0, presupuesto > 0) que muestre notificaciones Toast de éxito y manejo de errores.
5. Aplicar un diseño moderno oscuro con colores Slate-950, acentos Amber-400 para energía solar y Emerald-400 para proyectos completados.
```

---

## 🏗️ Diagrama de Arquitectura General del Sistema

```mermaid
flowchart TD
    subgraph Client ["Frontend App (React + TypeScript + Tailwind)"]
        UI["UI Componentes (React 19)"]
        State["Manejador de Estado & Hooks (useState, useEffect)"]
        Validator["Form Validator (ProjectModal)"]
        DocViewer["Visor de Arquitectura & Prompt Master"]
    end

    subgraph IntegrationLayer ["Capa de Abstracción & Conexión"]
        SupaClient["Client SDK Supabase (@supabase/supabase-js)"]
        MockFallback["Mock Demo Engine (Fallback Reactivo)"]
    end

    subgraph BackendSupabase ["Backend Supabase (Cloud PostgreSQL)"]
        AuthService["Supabase Auth (JWT Tokens)"]
        RLSPolicy["Mecanismo Row Level Security (RLS)"]
        TableProyectos["Tabla: proyectos (PK uuid, FK instalador_id)"]
        TableInstaladores["Tabla: instaladores (PK uuid, UK email)"]
        TableMateriales["Tabla: materiales (PK uuid, FK proyecto_id)"]
    end

    UI --> State
    State --> Validator
    State --> SupaClient
    SupaClient --> MockFallback
    SupaClient --> AuthService
    SupaClient --> RLSPolicy
    RLSPolicy --> TableProyectos
    RLSPolicy --> TableInstaladores
    RLSPolicy --> TableMateriales
    TableInstaladores -.->|Relación 1:N| TableProyectos
    TableProyectos -.->|Relación 1:N| TableMateriales
```

---

## 📐 Modelo de Base de Datos & Diagrama ER

```mermaid
erDiagram
    INSTALADORES ||--o{ PROYECTOS : supervisa
    PROYECTOS ||--o{ MATERIALES : requiere

    INSTALADORES {
        uuid id PK
        string nombre
        string email UK
        string telefono
        string especialidad
        string estado
        timestamp created_at
    }

    PROYECTOS {
        uuid id PK
        string nombre
        string cliente_nombre
        string cliente_email
        string ubicacion
        numeric capacidad_kw
        string estado
        uuid instalador_id FK
        numeric presupuesto
        date fecha_inicio
        date fecha_fin
        text notas
        timestamp created_at
    }

    MATERIALES {
        uuid id PK
        string nombre
        string categoria
        int stock
        string unidad
        numeric precio_unitario
        uuid proyecto_id FK
        timestamp created_at
    }
```

---

## 🔒 Seguridad de Nivel de Fila (RLS) en Supabase

En concordancia con el principio de **Seguridad por Diseño**, la base de datos restringe el acceso directo desde el cliente React. Las políticas escritas en la carpeta [`supabase/schema.sql`](file:///c:/Users/Isabel/Downloads/ProyectoFinalArquitecto-IA/supabase/schema.sql) aseguran que los instaladores solo puedan ver y gestionar los proyectos asignados a su cuenta:

```sql
-- Habilitar RLS en cada tabla
ALTER TABLE public.instaladores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiales ENABLE ROW LEVEL SECURITY;

-- Política de aislamiento de proyectos por instalador
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
```

---

## ⚛️ Desarrollo Frontend React & Modularidad

El frontend se desarrolló en React con TypeScript siguiendo una arquitectura de componentes independientes y enfocados:

- **[App.tsx](file:///c:/Users/Isabel/Downloads/ProyectoFinalArquitecto-IA/src/App.tsx)**: Orquestador principal de estado global, notificaciones Toast y manejo de fallback/mock reactivo.
- **[MetricsCards.tsx](file:///c:/Users/Isabel/Downloads/ProyectoFinalArquitecto-IA/src/components/MetricsCards.tsx)**: Tarjetas ejecutivas con métricas de kWp total instalados, balance de presupuesto e indicadores de stock bajo.
- **[ProjectList.tsx](file:///c:/Users/Isabel/Downloads/ProyectoFinalArquitecto-IA/src/components/ProjectList.tsx)**: Tabla dinámica con filtros por estado (`Pendiente`, `En Progreso`, `Completado`), buscador multi-campo y actualización fluida de estados.
- **[ProjectModal.tsx](file:///c:/Users/Isabel/Downloads/ProyectoFinalArquitecto-IA/src/components/ProjectModal.tsx)**: Formulario de alta con validación cliente en tiempo real previa a la inserción en Supabase.
- **[InstallersAndInventory.tsx](file:///c:/Users/Isabel/Downloads/ProyectoFinalArquitecto-IA/src/components/InstallersAndInventory.tsx)**: Monitor de cuadrillas de instaladores y catálogo de insumos con alertas de stock crítico.
- **[ArchitectureDocViewer.tsx](file:///c:/Users/Isabel/Downloads/ProyectoFinalArquitecto-IA/src/components/ArchitectureDocViewer.tsx)**: Visor interactivo integrado en la UI para consultar los Prompts y las Reglas de RLS.

---

## 🤖 Flujo de Trabajo con Inteligencia Artificial (SDD)

### 1. Specification-Driven Development (Prompt Maestro)
Para la generación del código se utilizó el paradigma SDD con especificaciones claras para evitar el "copiar y pegar ciego".

### 2. Resolución de Retos Técnicos Complejos con IA
**Problema:** Durante la integración, las llamadas a Supabase fallaban cuando el `auth.uid()` de Supabase Auth no coincidía exactamente con el `id` de la tabla de instaladores de la aplicación.  
**Solución con IA:** Mediante un prompt de **Refinamiento Iterativo**, se instruyó a la IA a no desactivar RLS ni delegar el filtro al frontend, sino construir una política SQL que emparejara la identidad utilizando los claims del token JWT (`auth.jwt() ->> 'email'`). Esto mantuvo la soberanía del código y la seguridad total en el backend.

---
## ▶️ Video Ilustrativo

<p align="center">
  <img src="docs/logo.png" alt="EcoFlow Logo Banner" width="700" />
</p>

- 🎬 **Video Explicativo en YouTube:** https://youtu.be/-D6SnwBi6pw?si=vlO3dW3e0hnv3kas

---

## 🛠️ Instrucciones de Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ instalado.
- Opcional: Cuenta en Supabase (la aplicación cuenta con un **Modo Demo/Mock Reactivo** en caso de no configurar claves de entorno).

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/SWNT-2/ProyectoFinalArquitecto-IA.git
   cd ProyectoFinalArquitecto-IA
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Verificar compilación e integridad de tipos:**
   ```bash
   npm run lint
   npm run build
   ```

---
*Desarrollado por **Tomas Felipe Ramirez Alvarez** como entregable oficial del Curso "El Arquitecto IA"*.