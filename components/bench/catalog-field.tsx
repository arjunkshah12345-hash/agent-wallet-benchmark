"use client";

import type { CSSProperties } from "react";

import { DitherShader } from "@/lib/dither";
import { O11_SOURCES } from "@/lib/bench";

const total = O11_SOURCES.reduce((sum, s) => sum + s.value, 0);
const edgeA = O11_SOURCES[0].value / total;
const edgeB = (O11_SOURCES[0].value + O11_SOURCES[1].value) / total;

// Which source a column belongs to, and how far it is from the nearest edge
// in cells, so each band gets a clean gap.
const HELPERS = `
float catRegion(float x) {
  return x < catEdgeA ? 0.0 : (x < catEdgeB ? 1.0 : 2.0);
}

float catGap(vec2 uv, vec2 res) {
  float da = abs(uv.x - catEdgeA) * res.x;
  float db = abs(uv.x - catEdgeB) * res.x;
  return smoothstep(1.5, 3.0, min(da, db));
}
`;

const FIELD = `${HELPERS}
float field(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  float region = catRegion(uv.x);
  float base = region == 1.0 ? 0.62 : (region == 0.0 ? 0.5 : 0.34);
  float grain = fbm(p * 2.2 + vec2(t * 0.03, t * 0.012 + region * 3.1));
  float tone = base + (grain - 0.5) * 0.7;
  float rise = smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.82, uv.y);
  return clamp(tone * rise * catGap(uv, res), 0.0, 1.0);
}
`;

const COLOR_FIELD = `${HELPERS}
vec3 colorField(vec2 uv, vec2 res, float t) {
  float region = catRegion(uv.x);
  if (region == 1.0) return vec3(0.98, 0.62, 0.3);
  if (region == 0.0) return vec3(0.86, 0.86, 0.88);
  return vec3(0.44, 0.44, 0.48);
}
`;

const shares = O11_SOURCES.map((s) => ({ ...s, share: s.value / total }));

export const CatalogField = ({ large = false }: { large?: boolean }) => (
  <figure className="w-full">
    <div className="relative h-44 w-full overflow-hidden rounded-md border border-border sm:h-60">
      <DitherShader
        aria-hidden
        className="absolute inset-0"
        colorField={COLOR_FIELD}
        field={FIELD}
        matrix="bayer4"
        speed={0.8}
        stillTime={6}
        uniforms={{ catEdgeA: edgeA, catEdgeB: edgeB }}
      />
    </div>
    <div
      className={`mt-3 grid gap-3 sm:[grid-template-columns:var(--cat-cols)] ${large ? "text-xl" : "text-sm"}`}
      style={{ "--cat-cols": shares.map((s) => `${s.value}fr`).join(" ") } as CSSProperties}
    >
      {shares.map((s, i) => (
        <div className="min-w-0" key={s.label}>
          <div
            className={
              i === 1
                ? "font-medium text-[oklch(0.79_0.15_62)] tabular-nums"
                : "font-medium text-foreground tabular-nums"
            }
          >
            {s.value.toLocaleString("en-US")}
            <span className="ml-1.5 font-normal text-muted-foreground">
              {Math.round(s.share * 100)}%
            </span>
          </div>
          <div className={large ? "text-muted-foreground" : "text-muted-foreground sm:truncate"}>{s.label}</div>
        </div>
      ))}
    </div>
    <figcaption className="sr-only">
      Of o11&apos;s {total.toLocaleString("en-US")} public tool contracts,{" "}
      {O11_SOURCES.map((s) => `${s.value.toLocaleString("en-US")} ${s.label.toLowerCase()}`).join(", ")}.
    </figcaption>
  </figure>
);
