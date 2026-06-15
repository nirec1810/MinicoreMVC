import { createClient } from "@supabase/supabase-js";

// ── Tipos ────────────────────────────────────────────────────

export interface FilaEnvioRaw {
  id_envio: number;
  id_repartidor: number;
  peso_kg: number;
  fecha_envio: string;
  zonas: {
    nombre_zona: string;
    tarifa_por_kg: number;
  } | {
    nombre_zona: string;
    tarifa_por_kg: number;
  }[];
  repartidores: {
    nombre: string;
  } | {
    nombre: string;
  }[];
}

export interface FilaRepartidor {
  id_repartidor: number;
  nombre: string;
}

// ── Cliente Supabase ─────────────────────────────────────────

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key);
}

// ── Queries ──────────────────────────────────────────────────

export async function obtenerTodosLosRepartidores(): Promise<FilaRepartidor[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("repartidores")
    .select("id_repartidor, nombre")
    .order("id_repartidor", { ascending: true });

  if (error) {
    throw new Error(`Error al consultar repartidores: ${error.message}`);
  }

  return (data ?? []) as FilaRepartidor[];
}

export async function obtenerEnviosPorRango(
  fechaInicio: string,
  fechaFin: string
): Promise<FilaEnvioRaw[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("envios")
    .select(`
      id_envio,
      id_repartidor,
      peso_kg,
      fecha_envio,
      zonas (nombre_zona, tarifa_por_kg),
      repartidores (nombre)
    `)
    .gte("fecha_envio", fechaInicio)
    .lte("fecha_envio", fechaFin)
    .order("id_repartidor", { ascending: true });

  if (error) {
    throw new Error(`Error al consultar envíos: ${error.message}`);
  }

  return (data ?? []) as FilaEnvioRaw[];
}