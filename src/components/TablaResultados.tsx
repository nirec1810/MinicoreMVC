import { Fragment } from "react";
import { ResumenRepartidor } from "@/src/controller/calcularCostos.controller";

interface Props {
  repartidores: ResumenRepartidor[];
  fechaInicio: string;
  fechaFin: string;
}

function formatearFecha(fecha: string): string {
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

function formatearUSD(valor: number): string {
  return valor.toLocaleString("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export default function TablaResultados({ repartidores, fechaInicio, fechaFin }: Props) {
  const totalGeneral = repartidores.reduce((acc, r) => acc + r.costo_total, 0);
  const totalEnvios = repartidores.reduce((acc, r) => acc + r.total_envios, 0);

  if (repartidores.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        No se encontraron envíos entre el {formatearFecha(fechaInicio)} y el {formatearFecha(fechaFin)}.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-500">
          {formatearFecha(fechaInicio)} — {formatearFecha(fechaFin)}
        </p>
        <p className="text-sm text-gray-700">
          {totalEnvios} envíos · total{" "}
          <span className="font-semibold">{formatearUSD(totalGeneral)}</span>
        </p>
      </div>

      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-left px-3 py-2 border-b border-gray-200">Repartidor</th>
            <th className="text-center px-3 py-2 border-b border-gray-200">Envíos</th>
            <th className="text-right px-3 py-2 border-b border-gray-200">Total kg</th>
            <th className="text-left px-3 py-2 border-b border-gray-200">Zona</th>
            <th className="text-right px-3 py-2 border-b border-gray-200">Tarifa/kg</th>
            <th className="text-right px-3 py-2 border-b border-gray-200">Costo total</th>
          </tr>
        </thead>
        <tbody>
          {repartidores.map((rep, idx) => {
            const sinEnvios = rep.total_envios === 0;
            const bgColor = idx % 2 === 0 ? "bg-white" : "bg-gray-50";

            // Repartidor sin envíos en el período
            if (sinEnvios) {
              return (
                <tr key={rep.id_repartidor} className={bgColor}>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-400">
                    {rep.nombre_repartidor}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-center text-gray-400">
                    0
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-right text-gray-400">
                    —
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-400">
                    —
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-right text-gray-400">
                    —
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-right text-gray-400">
                    No aplica
                  </td>
                </tr>
              );
            }

            // Repartidor con envíos — una fila por zona
            return (
              <Fragment key={rep.id_repartidor}>
                {rep.desglose_zonas.map((zona, zi) => (
                  <tr key={`${rep.id_repartidor}-${zi}`} className={bgColor}>
                    <td className="px-3 py-2 border-b border-gray-100">
                      {zi === 0 ? rep.nombre_repartidor : ""}
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 text-center">
                      {zi === 0 ? rep.total_envios : ""}
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 text-right">
                      {zi === 0 ? `${rep.total_kg} kg` : ""}
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 text-gray-600">
                      {zona.nombre_zona}
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 text-right text-gray-600">
                      {formatearUSD(zona.tarifa_por_kg)}
                    </td>
                    <td className="px-3 py-2 border-b border-gray-100 text-right">
                      {zi === 0 ? (
                        <span className="font-semibold">{formatearUSD(rep.costo_total)}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">{formatearUSD(zona.subtotal)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <td className="px-3 py-2">Total general</td>
            <td className="px-3 py-2 text-center">{totalEnvios}</td>
            <td className="px-3 py-2 text-right">
              {repartidores.reduce((a, r) => a + r.total_kg, 0).toFixed(2)} kg
            </td>
            <td colSpan={2}></td>
            <td className="px-3 py-2 text-right">{formatearUSD(totalGeneral)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}