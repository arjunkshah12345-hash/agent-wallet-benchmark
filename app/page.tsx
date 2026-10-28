import type { ReactNode } from "react";

import { CatalogField } from "@/components/bench/catalog-field";
import { CatalogBars, HeadToHead, LatencyBars } from "@/components/bench/charts";
import { Leaderboard } from "@/components/bench/leaderboard";
import { Divider } from "@/components/dithercn/divider";
import { DitherNumber } from "@/components/dithercn/dither-number";
import { DonutChart } from "@/components/dithercn/donut-chart";
import latency from "@/data/latency.json";
import {
  ALSO_RAN,
  FEATURE_MATRIX,
  FEATURES,
  MEASURED_ON,
  O11_SAMPLE,
  VENDORS,
} from "@/lib/bench";

const Section = ({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) => (
  <section className="scroll-mt-20 py-16 sm:py-24" id={id}>
    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
    {lede && <div className="mt-3 max-w-2xl text-muted-foreground">{lede}</div>}
    <div className="mt-10">{children}</div>
  </section>
);

const Mark = ({ value }: { value: boolean | null | undefined }) =>
  value === true ? (
    <span aria-label="Yes" className="text-foreground">
      ✓
    </span>
  ) : value === false ? (
    <span aria-label="No" className="text-muted-foreground/60">
      ✕
    </span>
  ) : (
    <span aria-label="Not documented" className="text-muted-foreground/40">
      ?
    </span>
  );

const endpointsTimed = latency.length;
const vendorsTimed = new Set(latency.map((r) => r.vendor)).size;

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 text-sm">
          <a className="font-medium" href="#top">
            Agent wallet benchmark
          </a>
          <div className="flex gap-6 text-muted-foreground">
            <a className="hidden hover:text-foreground sm:inline" href="#scores">Scores</a>
            <a className="hidden hover:text-foreground sm:inline" href="#catalogs">Catalogs</a>
            <a className="hidden hover:text-foreground sm:inline" href="#speed">Speed</a>
            <a className="hidden hover:text-foreground sm:inline" href="#features">Features</a>
            <a className="hidden hover:text-foreground sm:inline" href="#method">Method</a>
            <a className="hover:text-foreground" href="https://github.com/arjunkshah12345-hash/agent-wallet-benchmark">GitHub</a>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5" id="top">
        <section className="pt-16 pb-12 sm:pt-24">
          <p className="text-sm text-muted-foreground">Measured {MEASURED_ON}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            How o11 compares with ten other agent tool wallets
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            We counted public catalogs, sampled 240 of o11&apos;s tool contracts, and timed {endpointsTimed}{" "}
            public endpoints across {vendorsTimed} vendors. o11 has the best spend controls in the field.
            Most of its catalog is someone else&apos;s.
          </p>
          <div className="mt-14">
            <CatalogField />
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              o11&apos;s 8,172 public tool contracts by where they came from. o11 advertises 8,416 tools; about a
              third of the public index was written by o11 itself.
            </p>
          </div>
        </section>

        <Divider decorative fade={0.8} />

        <section className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">The short version</h2>
          <div className="space-y-5 text-pretty text-muted-foreground">
            <p>
              <span className="text-foreground">o11 designed the controls right.</span> Each agent gets a card
              with an allowance, a tool allowlist, a per-call ceiling and approval states, inside nested budgets.
              Every call goes quote, invoke, receipt, with idempotency keys. Nobody else here has all of that.
            </p>
            <p>
              <span className="text-foreground">Its catalog lead is borrowed and unverified.</span> 48% of the
              public contracts are sourced from Treg&apos;s GitHub catalog and 18% from AgentMuxer. Every contract
              is marked captured_contract_only, and none of the 240 we sampled had been checked against a live
              provider account.
            </p>
            <p>
              <span className="text-foreground">It is not shipping money yet.</span> The client is 0.1.9 with npm
              publication pending, the goods checkout is stubbed, there is no pricing page, and o11&apos;s own
              comparison posts say card funding was disabled in the build they audited.
            </p>
            <p>
              <span className="text-foreground">What to use today.</span> Treg for breadth you can check, 0%
              markup and free failed calls. Locus Pro if per-agent governance matters most. Coinbase x402 or
              Orthogonal if your agent pays in stablecoins. Watch o11 once card funding is live.
            </p>
          </div>
        </section>

        <Divider decorative fade={0.8} />

        <Section
          id="scores"
          lede={
            <p>
              Seven dimensions, each scored 0 to 5 from public docs and our own probes, shown out of 100. Change
              the weighting to match what you are building, and open a vendor to read the reason behind every
              score. &ldquo;Docs only&rdquo; means we could not probe anything public.
            </p>
          }
          title="Scores"
        >
          <Leaderboard />
        </Section>

        <section className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">o11, Treg and Monid</h2>
            <div className="mt-4 space-y-4 text-pretty text-muted-foreground">
              <p>
                All three call themselves the OpenRouter for agent tools, and they trade strengths almost
                exactly.
              </p>
              <p>
                o11 wins on controls and loses on maturity. Treg wins on pricing and call safety: every price
                shows its source and when it was checked, failed calls are free, and retries replay for 24
                hours. Monid is the only one of the three that lets an agent pay per run in USDC.
              </p>
              <p>Hover a point for the score, or click the legend to isolate one vendor.</p>
            </div>
          </div>
          <HeadToHead />
        </section>

        <Divider decorative fade={0.8} />

        <Section
          id="catalogs"
          lede={
            <p>
              Tool counts are the headline on every one of these sites. We tried to count each catalog without
              an account. Coinbase&apos;s x402 Bazaar is left off the chart: its public index lists 86,533 paid
              resources, which would flatten every other bar, though anyone can list anything there.
            </p>
          }
          title="Catalogs: claimed and countable"
        >
          <CatalogBars />
          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <h3 className="text-lg font-medium">Inside o11&apos;s catalog</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                A random sample of 240 contracts from o11&apos;s public index, fetched one by one. The largest
                single provider, tikhub, accounts for 1,900 tools, 23% of the index. A variable price depends on the input.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <dt className="text-sm text-muted-foreground">Checked against a live account</dt>
                  <dd className="mt-1">
                    <DitherNumber size="md" suffix={` of ${O11_SAMPLE.n}`} trigger="in-view" value={O11_SAMPLE.liveChecked} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Carry a numeric price</dt>
                  <dd className="mt-1">
                    <DitherNumber size="md" suffix="%" trigger="in-view" value={O11_SAMPLE.numericPricePct} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Median paid call</dt>
                  <dd className="mt-1">
                    <DitherNumber
                      format={{ style: "currency", currency: "USD", minimumFractionDigits: 4 }}
                      size="md"
                      trigger="in-view"
                      value={O11_SAMPLE.medianPaidUsd}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Middle 80% of paid calls</dt>
                  <dd className="mt-2 text-2xl font-semibold tabular-nums">
                    ${O11_SAMPLE.p10Usd} to ${O11_SAMPLE.p90Usd}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="relative min-w-0 justify-self-center overflow-hidden p-2">
            <DonutChart
              colors={["blue", "ink", "grey"]}
              data={O11_SAMPLE.priceBasis}
              label="Price basis"
              unit=" contracts"
            />
            </div>
          </div>
        </Section>

        <Divider decorative fade={0.8} />

        <Section
          id="speed"
          lede={
            <p>
              Twelve requests per endpoint from one machine on {MEASURED_ON}, timing the first byte. These are
              public, unauthenticated surfaces: an MCP handshake that answers 401, and the skill file an agent
              reads first. Paid tool calls need funded accounts, so they are not timed here.
            </p>
          }
          title="Speed of the public surfaces"
        >
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <h3 className="font-medium">MCP handshake, milliseconds</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Time to the answer to an unauthenticated initialize. Every server returns 401 except Nevermined, which returns 200.
              </p>
              <div className="mt-6">
                <LatencyBars kind="mcp" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">skill.md, milliseconds</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The file an agent fetches to learn how to use the service.
              </p>
              <div className="mt-6">
                <LatencyBars kind="skill" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Public catalog, milliseconds</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                o11 serves its whole 2.4 MB index in one file; Treg answers a search query.
              </p>
              <div className="mt-6">
                <LatencyBars kind="catalog" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">llms.txt, milliseconds</h3>
              <p className="mt-1 text-sm text-muted-foreground">The plain-text index for language models.</p>
              <div className="mt-6">
                <LatencyBars kind="llms" />
              </div>
            </div>
          </div>
        </Section>

        <Divider decorative fade={0.8} />

        <Section
          id="features"
          lede={<p>From each vendor&apos;s docs. A question mark means we could not find it documented either way.</p>}
          title="Features"
        >
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-normal">Feature</th>
                  {VENDORS.map((v) => (
                    <th
                      className={`px-2 py-2 text-center font-normal ${v.id === "o11" ? "text-[oklch(0.79_0.15_62)]" : ""}`}
                      key={v.id}
                    >
                      {v.name.replace(" Instant", "").replace(" Pro", "").replace("Coinbase ", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f) => (
                  <tr className="border-b border-border/60" key={f.key}>
                    <td className="py-2.5 pr-4">{f.label}</td>
                    {VENDORS.map((v) => (
                      <td className={`px-2 text-center ${v.id === "o11" ? "bg-foreground/[0.03]" : ""}`} key={v.id}>
                        <Mark value={FEATURE_MATRIX[v.id]?.[f.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Divider decorative fade={0.8} />

        <Section id="vendors" title="Each vendor">
          <div className="divide-y divide-border border-y border-border">
            {VENDORS.map((v) => (
              <article className="grid gap-6 py-8 lg:grid-cols-[1fr_1.2fr_1.2fr]" key={v.id}>
                <div>
                  <h3 className={`text-lg font-medium ${v.id === "o11" ? "text-[oklch(0.79_0.15_62)]" : ""}`}>
                    <a className="hover:underline" href={v.url} rel="noreferrer" target="_blank">
                      {v.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.oneLiner}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{v.backing}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Strengths</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {v.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Weaknesses</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {v.weaknesses.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <h3 className="mt-16 font-medium">Also looked at, not scored</h3>
          <dl className="mt-4 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
            {ALSO_RAN.map((a) => (
              <div key={a.name}>
                <dt className="inline font-medium">{a.name}. </dt>
                <dd className="inline text-muted-foreground">{a.why}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Divider decorative fade={0.8} />

        <Section id="method" title="Method and limits">
          <div className="grid max-w-4xl gap-x-12 gap-y-6 text-sm text-muted-foreground sm:grid-cols-2">
            <p>
              <span className="text-foreground">Catalogs.</span> We downloaded o11&apos;s public contract index
              (8,172 tools), Treg&apos;s platform list (3,548 endpoints, 63% marked verified), Orthogonal&apos;s
              discover API (954 endpoints), Anyway&apos;s directory (193 endpoints, 10 of 37 providers healthy at
              fetch) and the size of Coinbase&apos;s x402 Bazaar (86,533). Other counts are the vendors&apos; own.
            </p>
            <p>
              <span className="text-foreground">o11 sample.</span> 240 contracts drawn at random (seed 42) from
              the public index and fetched individually, recording the price basis, the price and the
              verification fields.
            </p>
            <p>
              <span className="text-foreground">Speed.</span> curl from a single machine, 12 runs per endpoint,
              time to first byte. One location, one day: treat the ranking as rough and the gaps under 100 ms as
              noise.
            </p>
            <p>
              <span className="text-foreground">Scores.</span> Our judgement against the written reason shown for
              each one, from public docs, pricing pages, licences and press, plus the probes above. We made no
              paid calls and funded no accounts, so nothing here measures what happens when money moves.
            </p>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted-foreground">
          Measured {MEASURED_ON}. Code, data and probe scripts are{" "}
          <a className="text-foreground underline underline-offset-4" href="https://github.com/arjunkshah12345-hash/agent-wallet-benchmark">
            on GitHub
          </a>
          . Spot an error? Open an issue.
        </div>
      </footer>
    </>
  );
}
