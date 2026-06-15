"use server";

import {
  obtenerEnviosPorRango,
  obtenerTodosLosRepartidores,
  type FilaEnvioRaw,
} from "@/src/models/envio.model";

// ── Tipos de salida ───────────────────────────────────────────

export interface DesglosePorZona {
  nombre_zona: string;
  tarifa_por_kg: number;
  cantidad_envios: number;
  total_kg: number;
  subtotal: number;
}

export interface ResumenRepartidor {
  id_repartidor: number;
  nombre_repartidor: string;
  total_envios: number;
  total_kg: number;
  costo_total: number;
  desglose_zonas: DesglosePorZona[];
}

export interface ResultadoCalculo {
  ok: boolean;
  error?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  repartidores?: ResumenRepartidor[];
}

// ── Server Action ─────────────────────────────────────────────

export async function calcularCostosAction(
  formData: FormData
): Promise<ResultadoCalculo> {
  const fechaInicio = formData.get("fecha_inicio") as string;
  const fechaFin = formData.get("fecha_fin") as string;

  if (!fechaInicio || !fechaFin) {
    return { ok: false, error: "Ambas fechas son requeridas." };
  }

  if (fechaInicio > fechaFin) {
    return {
      ok: false,
      error: "La fecha de inicio no puede ser posterior a la fecha fin.",
    };
  }

  let filas: FilaEnvioRaw[];
  try {
    [filas] = await Promise.all([
      obtenerEnviosPorRango(fechaInicio, fechaFin),
    ]);
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error desconocido";
    return { ok: false, error: mensaje };
  }

  // Traer todos los repartidores para incluir los que no tienen envíos
  const todosLosRepartidores = await obtenerTodosLosRepartidores();

  // Inicializar el mapa con todos los repartidores en cero
  const mapaRepartidores = new Map<number, ResumenRepartidor>();
  for (const rep of todosLosRepartidores) {
    mapaRepartidores.set(rep.id_repartidor, {
      id_repartidor: rep.id_repartidor,
      nombre_repartidor: rep.nombre,
      total_envios: 0,
      total_kg: 0,
      costo_total: 0,
      desglose_zonas: [],
    });
  }

  // Agregar envíos al repartidor correspondiente
  for (const fila of filas) {
    const idRep = fila.id_repartidor;

    const zonaData = Array.isArray(fila.zonas) ? fila.zonas[0] : fila.zonas;
    const repData = Array.isArray(fila.repartidores) ? fila.repartidores[0] : fila.repartidores;

    const nombreZona = zonaData.nombre_zona;
    const tarifa = Number(zonaData.tarifa_por_kg);
    const peso = Number(fila.peso_kg);
    const costoEnvio = peso * tarifa;

    const rep = mapaRepartidores.get(idRep)!;
    rep.total_envios += 1;
    rep.total_kg = +(rep.total_kg + peso).toFixed(2);
    rep.costo_total = +(rep.costo_total + costoEnvio).toFixed(2);

    const zona = rep.desglose_zonas.find((z) => z.nombre_zona === nombreZona);
    if (zona) {
      zona.cantidad_envios += 1;
      zona.total_kg = +(zona.total_kg + peso).toFixed(2);
      zona.subtotal = +(zona.subtotal + costoEnvio).toFixed(2);
    } else {
      rep.desglose_zonas.push({
        nombre_zona: nombreZona,
        tarifa_por_kg: tarifa,
        cantidad_envios: 1,
        total_kg: peso,
        subtotal: +costoEnvio.toFixed(2),
      });
    }
  }

  // Ordenar: primero los que tienen envíos, luego los que no
  const resultado = Array.from(mapaRepartidores.values()).sort((a, b) => {
    if (a.total_envios === 0 && b.total_envios > 0) return 1;
    if (a.total_envios > 0 && b.total_envios === 0) return -1;
    return b.costo_total - a.costo_total;
  });

  return {
    ok: true,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    repartidores: resultado,
  };
}