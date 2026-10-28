"use client";

import { Bar } from "@/components/dither-kit/bar";
import { BarChart } from "@/components/dither-kit/bar-chart";
import type { ChartConfig } from "@/components/dither-kit/chart-context";
import { Legend } from "@/components/dither-kit/legend";
import { Radar } from "@/components/dither-kit/radar";
import { RadarChart } from "@/components/dither-kit/radar-chart";
import { Tooltip } from "@/components/dither-kit/tooltip";
import { XAxis } from "@/components/dither-kit/x-axis";
import { YAxis } from "@/components/dither-kit/y-axis";
import latency from "@/data/latency.json";
import { DIMENSIONS, VENDORS } from "@/lib/bench";

const byId = Object.fromEntries(VENDORS.map((v) => [v.id, v]));

const radarData = DIMENSIONS.map((d) => ({
  dimension: d.label,
  o11: byId.o11.scores[d.key],
  treg: byId.treg.scores[d.key],
  monid: byId.monid.scores[d.key],
}));

const radarConfig = {
  o11: { label: "o11", color: "orange" },
  treg: { label: "Treg", color: "blue" },
  monid: { label: "Monid", color: "green" },
} satisfies ChartConfig;

export const HeadToHead = () => (
  <div className="h-[340px] w-full sm:h-[440px]">
    <RadarChart bloom="off" config={radarConfig} data={radarData} margins={{ left: 64, right: 64 }} nameKey="dimension">
      <Radar dataKey="treg" variant="dotted" />
      <Radar dataKey="monid" variant="hatched" />
      <Radar dataKey="o11" variant="gradient" />
      <Legend align="center" isClickable />
      <Tooltip labelKey="dimension" valueFormatter={(v) => `${v} of 5`} />
    </RadarChart>
  </div>
);

// x402's 86,533 would flatten every other bar, so it is reported in the text.
const catalogData = VENDORS.filter((v) => v.id !== "x402")
  .map((v) => ({
    vendor: v.name,
    claimed: v.claimedTools ?? 0,
    public: v.publicTools ?? 0,
  }))
  .sort((a, b) => b.claimed - a.claimed);

const catalogConfig = {
  claimed: { label: "Claimed on the site", color: "grey" },
  public: { label: "Countable without an account", color: "blue" },
} satisfies ChartConfig;

const thousands = (v: number) => (v >= 1000 ? `${v / 1000}k` : `${v}`);

export const CatalogBars = () => (
  <div className="-mx-5 overflow-x-auto px-5">
  <div className="h-[360px] w-full min-w-[680px]">
    <BarChart config={catalogConfig} data={catalogData} margins={{ left: 44, bottom: 56 }}>
      <XAxis dataKey="vendor" maxTicks={12} tickFormatter={(v) => String(v).replace(" Instant", "").replace(" Pro", "")} />
      <YAxis tickCount={5} tickFormatter={thousands} />
      <Bar dataKey="claimed" variant="hatched" />
      <Bar dataKey="public" variant="gradient" />
      <Legend align="left" />
      <Tooltip labelKey="vendor" valueFormatter={(v) => (v ? v.toLocaleString("en-US") : "none")} />
    </BarChart>
  </div>
  </div>
);

type LatencyRow = { vendor: string; kind: string; ttfb_p50_ms: number; ttfb_p90_ms: number; codes: Record<string, number> };
const rows = latency as unknown as LatencyRow[];

const NAMES: Record<string, string> = { "x402 Bazaar": "x402" };

const pick = (kind: string) =>
  rows
    .filter((r) => r.kind === kind && r.ttfb_p50_ms > 0)
    .map((r) => ({ vendor: NAMES[r.vendor] ?? r.vendor, p50: r.ttfb_p50_ms, p90: r.ttfb_p90_ms }))
    .sort((a, b) => a.p50 - b.p50);

const latencyConfig = {
  p50: { label: "Median", color: "blue" },
  p90: { label: "90th percentile", color: "grey" },
} satisfies ChartConfig;

export const LatencyBars = ({ kind }: { kind: "mcp" | "skill" | "llms" | "catalog" }) => {
  const data = pick(kind);
  return (
    <div className="h-[260px] w-full">
      <BarChart config={latencyConfig} data={data} margins={{ left: 44 }}>
        <XAxis dataKey="vendor" maxTicks={12} />
        <YAxis tickCount={4} tickFormatter={(v) => `${v}`} />
        <Bar dataKey="p50" variant="gradient" />
        <Bar dataKey="p90" variant="dotted" />
        <Legend align="left" />
        <Tooltip labelKey="vendor" valueFormatter={(v) => `${v} ms`} />
      </BarChart>
    </div>
  );
};
