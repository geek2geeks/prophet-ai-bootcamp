import { readFile } from "node:fs/promises";

import { getResourceAbsolutePath, getResourceById } from "@/lib/resource-files";

type ReportingCsvRow = {
  produto: string;
  segmento: string;
  apolices_ativas: number;
  premio_anualizado_eur: number;
  sinistros_incorridos_eur: number;
  lapses: number;
  despesas_eur: number;
  reserva_best_estimate_eur: number;
  lucro_tecnico_eur: number;
};

export type Day1ReportingRow = {
  produto: string;
  segmento: string;
  segmentLabel: string;
  lucroQ4: number;
  lucroQ1: number;
  deltaLucro: number;
  reservaQ4: number;
  reservaQ1: number;
  deltaReserva: number;
  sinistrosQ4: number;
  sinistrosQ1: number;
  deltaSinistros: number;
  lapsesQ4: number;
  lapsesQ1: number;
  deltaLapses: number;
  apolicesQ4: number;
  apolicesQ1: number;
  deltaApolices: number;
};

export type Day1ManualTask = {
  tarefa: string;
  equipa: string;
  frequencia: string;
  tempoManualHoras: number;
  riscoDeErro: string;
  impactoNoNegocio: string;
};

export type Day1ReportingLabData = {
  rows: Day1ReportingRow[];
  tasks: Day1ManualTask[];
  summary: {
    totalDeltaLucro: number;
    totalDeltaReserva: number;
    totalDeltaSinistros: number;
    totalManualHours: number;
  };
};

function parseCsv(content: string) {
  const [headerLine, ...lines] = content.trim().split(/\r?\n/);
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function readResourceText(resourceId: string) {
  const resource = getResourceById(resourceId);

  if (!resource) {
    throw new Error(`Recurso em falta: ${resourceId}`);
  }

  return readFile(getResourceAbsolutePath(resource), "utf8");
}

async function readReportingRows(resourceId: string): Promise<ReportingCsvRow[]> {
  const raw = await readResourceText(resourceId);

  return parseCsv(raw).map((row) => ({
    produto: row.produto,
    segmento: row.segmento,
    apolices_ativas: toNumber(row.apolices_ativas),
    premio_anualizado_eur: toNumber(row.premio_anualizado_eur),
    sinistros_incorridos_eur: toNumber(row.sinistros_incorridos_eur),
    lapses: toNumber(row.lapses),
    despesas_eur: toNumber(row.despesas_eur),
    reserva_best_estimate_eur: toNumber(row.reserva_best_estimate_eur),
    lucro_tecnico_eur: toNumber(row.lucro_tecnico_eur),
  }));
}

async function readManualTasks(): Promise<Day1ManualTask[]> {
  const raw = await readResourceText("day1/manual_reporting_tasks.csv");

  return parseCsv(raw).map((row) => ({
    tarefa: row.tarefa,
    equipa: row.equipa,
    frequencia: row.frequencia,
    tempoManualHoras: toNumber(row.tempo_manual_horas),
    riscoDeErro: row.risco_de_erro,
    impactoNoNegocio: row.impacto_no_negocio,
  }));
}

export async function getDay1ReportingLabData(): Promise<Day1ReportingLabData> {
  const [q4Rows, q1Rows, tasks] = await Promise.all([
    readReportingRows("day1/reporting_vida_q4_2025.csv"),
    readReportingRows("day1/reporting_vida_q1_2026.csv"),
    readManualTasks(),
  ]);

  const q1ByKey = new Map(q1Rows.map((row) => [`${row.produto}:${row.segmento}`, row]));
  const rows = q4Rows.map((q4Row) => {
    const key = `${q4Row.produto}:${q4Row.segmento}`;
    const q1Row = q1ByKey.get(key);

    if (!q1Row) {
      throw new Error(`Linha Q1 em falta para ${key}`);
    }

    return {
      produto: q4Row.produto,
      segmento: q4Row.segmento,
      segmentLabel: `${q4Row.produto} | ${q4Row.segmento}`,
      lucroQ4: q4Row.lucro_tecnico_eur,
      lucroQ1: q1Row.lucro_tecnico_eur,
      deltaLucro: q1Row.lucro_tecnico_eur - q4Row.lucro_tecnico_eur,
      reservaQ4: q4Row.reserva_best_estimate_eur,
      reservaQ1: q1Row.reserva_best_estimate_eur,
      deltaReserva: q1Row.reserva_best_estimate_eur - q4Row.reserva_best_estimate_eur,
      sinistrosQ4: q4Row.sinistros_incorridos_eur,
      sinistrosQ1: q1Row.sinistros_incorridos_eur,
      deltaSinistros: q1Row.sinistros_incorridos_eur - q4Row.sinistros_incorridos_eur,
      lapsesQ4: q4Row.lapses,
      lapsesQ1: q1Row.lapses,
      deltaLapses: q1Row.lapses - q4Row.lapses,
      apolicesQ4: q4Row.apolices_ativas,
      apolicesQ1: q1Row.apolices_ativas,
      deltaApolices: q1Row.apolices_ativas - q4Row.apolices_ativas,
    };
  });

  return {
    rows,
    tasks,
    summary: {
      totalDeltaLucro: rows.reduce((sum, row) => sum + row.deltaLucro, 0),
      totalDeltaReserva: rows.reduce((sum, row) => sum + row.deltaReserva, 0),
      totalDeltaSinistros: rows.reduce((sum, row) => sum + row.deltaSinistros, 0),
      totalManualHours: tasks.reduce((sum, task) => sum + task.tempoManualHoras, 0),
    },
  };
}
