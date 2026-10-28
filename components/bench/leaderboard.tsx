"use client";

import { LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";

import { ProgressBar } from "@/components/dithercn/progress-bar";
import { DIMENSIONS, PRESETS, VENDORS, weightedScore } from "@/lib/bench";
import { cn } from "@/lib/utils";

const ACCENT = "orange";

export const Leaderboard = () => {
  const [presetId, setPresetId] = useState<(typeof PRESETS)[number]["id"]>("balanced");
  const [open, setOpen] = useState<string | null>("o11");
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  const ranked = useMemo(
    () =>
      VENDORS.map((v) => ({ ...v, total: weightedScore(v.scores, preset.weights) })).sort(
        (a, b) => b.total - a.total || a.name.localeCompare(b.name),
      ),
    [preset],
  );

  return (
    <div>
      <div
        aria-label="Weighting"
        className="mb-6 flex flex-wrap gap-1.5"
        role="radiogroup"
      >
        {PRESETS.map((p) => (
          <button
            aria-checked={p.id === presetId}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              p.id === presetId
                ? "border-foreground/40 bg-foreground/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
            key={p.id}
            onClick={() => setPresetId(p.id)}
            role="radio"
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="hidden grid-cols-[2rem_minmax(8rem,1.2fr)_3rem_repeat(7,minmax(0,1fr))] items-end gap-x-3 border-b border-border pb-2 text-xs text-muted-foreground lg:grid">
        <span>#</span>
        <span>Vendor</span>
        <span className="text-right">Score</span>
        {DIMENSIONS.map((d) => (
          <span className="truncate" key={d.key} title={d.hint}>
            {d.label}
            {preset.weights[d.key] !== 1 && (
              <span className="ml-1 tabular-nums text-foreground/70">×{preset.weights[d.key]}</span>
            )}
          </span>
        ))}
      </div>

      <LayoutGroup>
        <ol>
          {ranked.map((v, i) => {
            const isO11 = v.id === "o11";
            const expanded = open === v.id;
            return (
              <motion.li
                className="border-b border-border"
                key={v.id}
                layout="position"
                transition={{ type: "spring", stiffness: 420, damping: 40 }}
              >
                <button
                  aria-expanded={expanded}
                  className="grid w-full grid-cols-[2rem_1fr_3rem] items-center gap-x-3 py-3 text-left lg:grid-cols-[2rem_minmax(8rem,1.2fr)_3rem_repeat(7,minmax(0,1fr))]"
                  onClick={() => setOpen(expanded ? null : v.id)}
                  type="button"
                >
                  <span className="text-sm tabular-nums text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0">
                    <span className={cn("font-medium", isO11 && "text-[oklch(0.79_0.15_62)]")}>
                      {v.name}
                    </span>
                    {v.evidence === "docs" && (
                      <span className="ml-2 text-xs text-muted-foreground">docs only</span>
                    )}
                    <ProgressBar
                      className="mt-1.5 lg:hidden"
                      color={isO11 ? ACCENT : "ink"}
                      hideLabel
                      label={`${v.name} total`}
                      size="sm"
                      value={v.total}
                    />
                  </span>
                  <span className="text-right text-lg font-semibold tabular-nums">{v.total}</span>
                  {DIMENSIONS.map((d) => (
                    <ProgressBar
                      className="hidden lg:block"
                      color={isO11 ? ACCENT : "ink"}
                      fill="solid"
                      hideLabel
                      key={d.key}
                      label={`${v.name} ${d.label}`}
                      max={5}
                      segments={5}
                      size="sm"
                      value={v.scores[d.key]}
                      valueText={`${v.scores[d.key]} of 5`}
                    />
                  ))}
                </button>
                {expanded && (
                  <motion.dl
                    animate={{ opacity: 1 }}
                    className="grid gap-x-8 gap-y-3 pb-6 pl-11 text-sm sm:grid-cols-2"
                    initial={{ opacity: 0 }}
                  >
                    {DIMENSIONS.map((d) => (
                      <div key={d.key}>
                        <dt className="font-medium">
                          {d.label}
                          <span className="ml-2 tabular-nums text-muted-foreground">
                            {v.scores[d.key]}/5
                          </span>
                        </dt>
                        <dd className="mt-0.5 text-muted-foreground">{v.why[d.key]}</dd>
                      </div>
                    ))}
                  </motion.dl>
                )}
              </motion.li>
            );
          })}
        </ol>
      </LayoutGroup>
    </div>
  );
};
