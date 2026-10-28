import type { Metadata } from "next";

import { CatalogField } from "@/components/bench/catalog-field";
import { ProgressBar } from "@/components/dithercn/progress-bar";
import latency from "@/data/latency.json";
import { MEASURED_ON, O11_SAMPLE, PRESETS, VENDORS, weightedScore } from "@/lib/bench";

// A fixed 1600×900 frame for the launch image and Open Graph card.
export const metadata: Metadata = { robots: { index: false } };

const ranked = VENDORS.map((v) => ({ ...v, total: weightedScore(v.scores, PRESETS[0].weights) })).sort(
  (a, b) => b.total - a.total || a.name.localeCompare(b.name),
);

const mcp = latency
  .filter((r) => r.kind === "mcp")
  .map((r) => ({ vendor: r.vendor, ms: r.ttfb_p50_ms }))
  .sort((a, b) => a.ms - b.ms);

export default function Card() {
  return (
    <div className="flex h-[900px] w-[1600px] flex-col justify-between bg-background p-16" id="card">
      <div>
        <p className="text-xl text-muted-foreground">Measured {MEASURED_ON}</p>
        <h1 className="mt-3 text-6xl font-semibold tracking-tight">11 agent tool wallets, benchmarked</h1>
      </div>

      <div className="grid grid-cols-[560px_1fr] gap-20">
        <ol className="space-y-[9px]">
          {ranked.map((v, i) => (
            <li className="grid grid-cols-[28px_200px_1fr_48px] items-center gap-4 text-2xl" key={v.id}>
              <span className="text-lg tabular-nums text-muted-foreground">{i + 1}</span>
              <span className={v.id === "o11" ? "text-[oklch(0.79_0.15_62)]" : ""}>{v.name.replace(" Instant", "")}</span>
              <ProgressBar
                animate={false}
                color={v.id === "o11" ? "orange" : "ink"}
                hideLabel
                label={v.name}
                size="md"
                value={v.total}
              />
              <span className="text-right font-semibold tabular-nums">{v.total}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-12">
          <div>
            <p className="mb-5 text-2xl">Where o11&apos;s 8,172 public tools come from</p>
            <CatalogField large />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="text-6xl font-semibold tabular-nums">
                {O11_SAMPLE.liveChecked} of {O11_SAMPLE.n}
              </p>
              <p className="mt-2 text-xl text-muted-foreground">sampled o11 contracts checked against a live account</p>
            </div>
            <div className="text-xl">
              <p className="mb-2 text-muted-foreground">MCP handshake, median</p>
              {mcp.map((m) => (
                <p className="flex justify-between tabular-nums" key={m.vendor}>
                  <span className={m.vendor === "o11" ? "text-[oklch(0.79_0.15_62)]" : ""}>{m.vendor}</span>
                  <span>{m.ms} ms</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
