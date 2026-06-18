# Mini Core Logística — MVC con Next.js 15

Sistema de cálculo de costos de envío por repartidor, implementado como
demostración del patrón **MVC** usando Next.js 15 y Supabase.

## MVC utilizado

**Next.js 15** con App Router implementa el patrón MVC de la siguiente manera:

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Modelo | `src/models/envio.model.ts` | Tipos TypeScript y queries a Supabase |
| Controlador | `src/actions/calcularCostos.action.ts` | Validación, lógica de negocio y cálculo de costos |
| Vista | `src/app/page.tsx` + `src/components/TablaResultados.tsx` | Formulario y tabla de resultados |

## Descripción

Una empresa de logística necesita saber cuánto costaron los envíos
realizados por cada repartidor en un período determinado. El sistema
filtra por rango de fechas y calcula el costo total usando la fórmula:
- costo_envio = peso_kg × tarifa_por_kg
- costo_total_repartidor = Σ costo_envio (todos sus envíos en el período)

## Correr localmente

**Requisitos:** Node.js 18+, cuenta en Supabase

**1. Clonar e instalar**
```bash
git clone [<url-del-repo>](https://github.com/nirec1810/MinicoreMVC.git)
cd minicore
npm install
```

**2. Configurar variables de entorno**
```bash
# Crear .env.local en la raíz
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_anon_key
```

**3. Crear tablas y seed en Supabase**
### Repartidor 
<img width="542" height="137" alt="image" src="https://github.com/user-attachments/assets/1fdd663e-bd32-4697-925f-df94517c91a7" />

### Envios 
<img width="551" height="377" alt="image" src="https://github.com/user-attachments/assets/6d029e4c-48bf-40ce-a913-4a2521d7a270" />

### Zonas 
<img width="468" height="163" alt="image" src="https://github.com/user-attachments/assets/c6e405a4-a5ac-4e2a-b754-af5f08bc8b8e" />


**4. Levantar el servidor**
```bash
npm run dev
# → http://localhost:3000
```

**Rango de prueba:** `2026-05-01` → `2026-05-31`

## Video explicativo

[Creación Video Mini Core Next.js y Supabase](https://youtu.be/yV7kI5-EBSQ)

## Proyecto deployado

[MinicoreMVC](https://minicore-mvc.vercel.app/)

## Documentación y recursos

- [Documentación oficial de Next.js](https://nextjs.org/docs)
- [Next.js 15 — Tutorial completo en español (YouTube)](https://www.youtube.com/watch?v=c_DPfd85qTM)
- [Documentación oficial de Supabase ](https://supabase.com/docs/guides/database/overview)
