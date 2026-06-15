import { calcularCostosAction } from "@/src/controller/calcularCostos.controller";
import TablaResultados from "@/src/components/TablaResultados";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const fechaInicio = params?.fecha_inicio ?? "";
  const fechaFin = params?.fecha_fin ?? "";

  let resultado = null;
  if (fechaInicio && fechaFin) {
    const fd = new FormData();
    fd.set("fecha_inicio", fechaInicio);
    fd.set("fecha_fin", fechaFin);
    resultado = await calcularCostosAction(fd);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">
        Costos de envío por repartidor
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Filtra por rango de fechas para calcular el costo total por repartidor.
      </p>

      <form method="GET" className="flex flex-wrap gap-4 items-end mb-8">
        <div className="flex flex-col gap-1">
          <label htmlFor="fecha_inicio" className="text-xs text-gray-500">
            Fecha inicio
          </label>
          <input
            type="date"
            id="fecha_inicio"
            name="fecha_inicio"
            defaultValue={fechaInicio}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800
                       focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fecha_fin" className="text-xs text-gray-500">
            Fecha fin
          </label>
          <input
            type="date"
            id="fecha_fin"
            name="fecha_fin"
            defaultValue={fechaFin}
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800
                       focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm
                     rounded transition-colors"
        >
          Calcular
        </button>
      </form>

      {resultado && !resultado.ok && (
        <p className="text-sm text-red-600">{resultado.error}</p>
      )}

      {resultado && resultado.ok && (
        <TablaResultados
          repartidores={resultado.repartidores ?? []}
          fechaInicio={resultado.fecha_inicio!}
          fechaFin={resultado.fecha_fin!}
        />
      )}

      {!resultado && (
        <p className="text-sm text-gray-400">
          Ingresa un rango de fechas y presiona Calcular.
        </p>
      )}
    </main>
  );
}