// Benchmark data, gathered 27 October 2026. Numbers marked "measured" come
// from public endpoints we fetched; everything else is from the vendor's own
// docs, site or press, with sources listed per vendor.

export const MEASURED_ON = "27 October 2026";

export const DIMENSIONS = [
  { key: "catalog", label: "Catalog", hint: "Breadth you can verify, not just claim" },
  { key: "pricing", label: "Pricing", hint: "Markup, fees, quotes, who pays for failures" },
  { key: "controls", label: "Spend controls", hint: "Per-agent caps, allowlists, approvals" },
  { key: "access", label: "Agent access", hint: "Remote MCP, CLI, REST, SDK, skill.md, llms.txt" },
  { key: "rails", label: "Payment rails", hint: "Card, stablecoin, x402/MPP, your own accounts" },
  { key: "reliability", label: "Call safety", hint: "Idempotency, receipts, refunds on failure" },
  { key: "maturity", label: "Maturity", hint: "Shipping status, verification, backing" },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];
export type Scores = Record<DimensionKey, number>;

export type Evidence = "measured" | "docs";

export interface Vendor {
  id: string;
  name: string;
  url: string;
  oneLiner: string;
  claimedTools: number | null;
  /** Tools we could count from a public, unauthenticated index. */
  publicTools: number | null;
  providers: number | null;
  evidence: Evidence;
  scores: Scores;
  why: Record<DimensionKey, string>;
  strengths: string[];
  weaknesses: string[];
  backing: string;
}

export const VENDORS: Vendor[] = [
  {
    id: "o11",
    name: "o11",
    url: "https://o11.ai",
    oneLiner: "One prepaid USD wallet and per-agent cards for about 8,400 paid tools, over MCP, CLI, SDK and HTTP.",
    claimedTools: 8416,
    publicTools: 8172,
    providers: 550,
    evidence: "measured",
    scores: { catalog: 3, pricing: 3, controls: 5, access: 5, rails: 3, reliability: 4, maturity: 1 },
    why: {
      catalog: "8,172 public contracts, the largest hosted index here, but 48% are sourced from Treg's catalog and none of our 240 samples was checked against a live account.",
      pricing: "Zero markup and a quote call, but no pricing page, an unpublished free credit, and failed work can still incur supplier fees.",
      controls: "Per-agent cards with allowances, tool allowlists, nested budgets, a per-call cost ceiling and approval states. The strongest model we found.",
      access: "Remote MCP with OAuth, stdio MCP via CLI, TypeScript SDK, plain HTTP, skill.md, llms.txt and OpenAPI.",
      rails: "Prepaid USD credits and your own provider accounts. x402 is settled upstream by o11, not offered to you. Funding methods are not documented.",
      reliability: "Idempotency keys, receipts, run IDs, cancel and dispute APIs. Failed calls are not guaranteed free.",
      maturity: "Client 0.1.9 with npm publication pending, the goods checkout is stubbed, and o11's own posts say card funding was disabled in the build they audited.",
    },
    strengths: [
      "Best-designed spend controls in the field: cards, allowlists, nested budgets, per-call ceilings, approvals",
      "Quote, invoke, receipt lifecycle with idempotency keys and disputes",
      "Wallet-funded and your own accounts in the same call, with no silent fallback",
    ],
    weaknesses: [
      "3,949 of 8,172 public contracts come from Treg's GitHub catalog, whose licence restricts hosted third-party use",
      "Every contract is marked captured_contract_only; 0 of 240 sampled were live-checked",
      "Very early: client 0.1.x, CLI needs Bun, no pricing page, goods purchase stubbed",
    ],
    backing: "Y Combinator W26, team of 2",
  },
  {
    id: "treg",
    name: "Treg",
    url: "https://treg.to",
    oneLiner: "OpenRouter for agent tools: one base URL and token, search by job, pay the provider rate.",
    claimedTools: 3935,
    publicTools: 3548,
    providers: 114,
    evidence: "measured",
    scores: { catalog: 4, pricing: 5, controls: 3, access: 5, rails: 2, reliability: 5, maturity: 3 },
    why: {
      catalog: "3,548 endpoints across 113 platforms in a public, searchable API; 63% marked verified. Skews to SEO, social and enrichment.",
      pricing: "Provider rate plus $0.000 markup, each price shows its source and check date, failed provider calls are free, from $0.0001.",
      controls: "Caps and tool allowlists exist, but caps are advisory under concurrency and there is no human approval flow.",
      access: "Remote MCP with OAuth, CLI, raw HTTP proxy, llms.txt, skill.md and a Claude Code plugin.",
      rails: "Card-funded prepaid balance and your own keys. No x402 or stablecoin rail.",
      reliability: "Idempotency-Key with 24h replay, a cost header on every call, an append-only ledger and audit log.",
      maturity: "Version 0.27 with a public catalog. The licence is Apache-2.0 plus restrictions, though the site says 100% open source.",
    },
    strengths: [
      "Largest catalog you can search without an account, with per-price source and check date",
      "0% markup and failed provider calls are free",
      "Idempotency with 24h replay, cost header, append-only ledger",
    ],
    weaknesses: [
      "Spend caps can be exceeded under concurrency; no approval flow",
      "Card only: no x402 or stablecoin rail",
      "Markets itself as 100% open source; the licence adds a hosted-service restriction",
    ],
    backing: "Superdesign; no funding disclosed",
  },
  {
    id: "monid",
    name: "Monid",
    url: "https://monid.ai",
    oneLiner: "The OpenRouter for agent tools: 2,800+ data endpoints, one key, one balance, or x402 per run.",
    claimedTools: 2800,
    publicTools: null,
    providers: 90,
    evidence: "measured",
    scores: { catalog: 3, pricing: 3, controls: 2, access: 4, rails: 4, reliability: 3, maturity: 3 },
    why: {
      catalog: "Claims 2,800+ endpoints with unusual Chinese-social and on-chain coverage, but even discover needs an API key, so we could not count it.",
      pricing: "Official docs say most endpoints carry 0 markup; press reports a 10% fee. Live price on inspect, provider errors billed $0.",
      controls: "A workspace-wide budget and a per-run cap. No per-agent caps, allowlists or approvals.",
      access: "Remote MCP with OAuth, skill.md, CLI and REST, plus editor plugins. No language SDK.",
      rails: "Prepaid USD balance, or x402 USDC per run on Base and Monad.",
      reliability: "Estimated cost is held then settled, errors are free, disputes exist. No idempotency keys on run.",
      maturity: "MIT connector engine with about 6.7k GitHub stars; pre-seed. Its own numbers disagree across pages.",
    },
    strengths: [
      "Card or x402 USDC on Base and Monad",
      "Endpoint health in discover, and provider errors billed $0",
      "Open-source connector engine you can run with your own keys",
    ],
    weaknesses: [
      "No public catalog: discover needs an API key",
      "Only workspace-wide limits; no per-agent caps or approvals",
      "Conflicting markup (0% in docs, 10% in press) and tool counts (hundreds, 2,000+, 2,800+)",
    ],
    backing: "Pre-seed: 1984 Ventures, Llama Ventures (per press)",
  },
  {
    id: "locus",
    name: "Locus Pro",
    url: "https://paywithlocus.com/pro",
    oneLiner: "3,954 paid agent tools from 57 providers behind one balance, with allowlists and run budgets.",
    claimedTools: 3954,
    publicTools: null,
    providers: 57,
    evidence: "docs",
    scores: { catalog: 3, pricing: 3, controls: 5, access: 4, rails: 3, reliability: 5, maturity: 3 },
    why: {
      catalog: "Claims 3,954 tools from 57 providers. We did not find a public index to count.",
      pricing: "Free tier, then $200 and $1,000 a month plans for team and customer billing. Markup not published.",
      controls: "Per-agent allowlists, per-call maximums and run budgets enforced before the provider is called.",
      access: "Remote MCP, CLI, REST, TypeScript SDK and llms.txt. No skill.md found.",
      rails: "Prepaid credits, USDC wallets on Base and your own APIs on the same ledger.",
      reliability: "Idempotency-Key, receipts, signed webhooks and sandbox keys that never charge.",
      maturity: "Y Combinator F25. Fewer public sources than the others, so lower confidence.",
    },
    strengths: [
      "Allowlist, per-call max and run budget enforced before dispatch",
      "Idempotency keys and charge-free sandbox keys",
      "Per-end-user balances and markup, built for platforms reselling tools",
    ],
    weaknesses: [
      "Free tier throttled to 5 calls a minute",
      "Monthly fees for team and customer billing",
      "57 providers against o11's 550",
    ],
    backing: "Y Combinator F25",
  },
  {
    id: "x402",
    name: "Coinbase x402",
    url: "https://docs.cdp.coinbase.com/x402",
    oneLiner: "The open HTTP 402 stablecoin payment standard, the public Bazaar index and an agent wallet.",
    claimedTools: 86533,
    publicTools: 86533,
    providers: null,
    evidence: "measured",
    scores: { catalog: 4, pricing: 5, controls: 2, access: 4, rails: 2, reliability: 2, maturity: 5 },
    why: {
      catalog: "86,533 paid resources in the public Bazaar index, with call volume and payer counts. Quality and uptime vary widely, and mainstream APIs appear only if someone wraps them.",
      pricing: "Zero protocol fee and the price is in the 402 challenge before you pay. Network fees only.",
      controls: "Wallet spending limits, mostly described in secondary press.",
      access: "CLI, REST, SDK, skill and llms.txt. MCP comes through the wallet, not a hosted tool server.",
      rails: "Stablecoins only (USDC on Base, other EVM chains and Solana).",
      reliability: "Price is known up front, but there are no documented receipts or idempotency.",
      maturity: "An open, self-hostable standard run by a public company.",
    },
    strengths: [
      "Open standard, zero protocol fee, self-hostable",
      "By far the largest index: 86,533 resources with usage signals",
      "Price known from the 402 challenge before paying",
    ],
    weaknesses: [
      "Stablecoin funding only",
      "Mainstream APIs only if someone wraps them in x402",
      "Merchant quality and uptime vary widely",
    ],
    backing: "Coinbase",
  },
  {
    id: "nevermined",
    name: "Nevermined",
    url: "https://nevermined.ai",
    oneLiner: "Agent payments infrastructure and a catalog of 160 paid services bought inside a spend mandate.",
    claimedTools: 160,
    publicTools: null,
    providers: null,
    evidence: "measured",
    scores: { catalog: 1, pricing: 2, controls: 4, access: 3, rails: 5, reliability: 3, maturity: 4 },
    why: {
      catalog: "160 services.",
      pricing: "A 2% buyer fee on external services, and credits hide the USD price.",
      controls: "Mandates with an amount, an expiry and a purchase count, with one-click revoke.",
      access: "Remote MCP, REST and TypeScript and Python SDKs. No CLI or skill.md.",
      rails: "Card, x402 stablecoins, MPP channels and Stripe or Braintree settlement.",
      reliability: "Readiness score and live health per service. Little published on idempotency or refunds.",
      maturity: "ISO 27001, SOC 2 Type II and PCI claims; about $7M raised.",
    },
    strengths: [
      "Mandates with amount, expiry and count, revocable in one click",
      "Card and crypto rails both supported",
      "Compliance claims: ISO 27001, SOC 2 Type II, PCI",
    ],
    weaknesses: ["Small catalog (160 services)", "2% buyer fee on external services", "Credits obscure the dollar price"],
    backing: "About $7M, led by Generative Ventures",
  },
  {
    id: "orthogonal",
    name: "Orthogonal",
    url: "https://www.orthogonal.com",
    oneLiner: "One key and one balance for 66 providers and 954 endpoints, with card, x402 and MPP.",
    claimedTools: 1000,
    publicTools: 954,
    providers: 66,
    evidence: "measured",
    scores: { catalog: 2, pricing: 3, controls: 1, access: 5, rails: 5, reliability: 2, maturity: 3 },
    why: {
      catalog: "954 endpoints across 66 APIs, all in a public index with schemas and prices.",
      pricing: "A dry-run quote, but a 5% fee on credit top-ups.",
      controls: "No documented per-agent caps, allowlists or approvals.",
      access: "Remote MCP, CLI, SDK, REST and skill.md, with agent self-signup.",
      rails: "Card credits, x402 on Base, MPP on Tempo and Circle Gateway nanopayments.",
      reliability: "No idempotency; the docs tell agents to check usage before retrying.",
      maturity: "$4.3M seed led by Pantera Capital, June 2026.",
    },
    strengths: [
      "Public catalog with schemas and prices, no account needed",
      "Four payment rails, including nanopayments",
      "Explicit quote and dry-run tool",
    ],
    weaknesses: ["66 providers", "No per-agent caps or allowlists", "No idempotency; 5% top-up fee"],
    backing: "$4.3M seed, Pantera Capital and Y Combinator",
  },
  {
    id: "composio",
    name: "Composio Instant",
    url: "https://composio.dev",
    oneLiner: "Wallet-funded paid tools inside Composio's 1,500+ app OAuth and tool platform.",
    claimedTools: 2001,
    publicTools: null,
    providers: 79,
    evidence: "docs",
    scores: { catalog: 3, pricing: 2, controls: 2, access: 5, rails: 2, reliability: 3, maturity: 3 },
    why: {
      catalog: "About 2,000 paid tools from 79 providers, next to 1,500+ OAuth apps. Only providers' core actions.",
      pricing: "0% markup on provider charges and failed calls are free, but prices are strings (no true quote) and normal tool-call fees apply on top.",
      controls: "Tool allowlists, but no dollar budget per agent and the balance is not a hard cap.",
      access: "MCP gateway, CLI, REST, Python and TypeScript SDKs, skill and llms.txt.",
      rails: "Prepaid USD balance and your own connected accounts.",
      reliability: "Per-call charge in responses and logs, failed calls free. No quote.",
      maturity: "A large platform, but Instant itself is marked experimental and gated.",
    },
    strengths: [
      "Your connected accounts take precedence automatically, mixed with wallet tools",
      "0% markup and failed calls are free",
      "Huge distribution (claims 1B+ tool calls a month)",
    ],
    weaknesses: [
      "No dollar budget per agent; balance is not a hard cap",
      "Prices are strings, so there is no machine-readable quote",
      "Experimental, and platform fees apply on top",
    ],
    backing: "Composio",
  },
  {
    id: "atxp",
    name: "ATXP",
    url: "https://atxp.ai",
    oneLiner: "Self-registering agent accounts with a wallet and email, and pay-per-call MCP tools.",
    claimedTools: 9,
    publicTools: null,
    providers: null,
    evidence: "measured",
    scores: { catalog: 1, pricing: 2, controls: 1, access: 5, rails: 4, reliability: 2, maturity: 4 },
    why: {
      catalog: "9 first-party tools.",
      pricing: "Free to create, but per-tool prices are not published.",
      controls: "No documented spend caps or allowlists.",
      access: "MCP, CLI, REST, TypeScript SDK, skill and llms.txt.",
      rails: "Account credits on Base, Solana, Polygon and Worldchain.",
      reliability: "Receipts, but little else documented.",
      maturity: "$19.2M seed with Stripe and Coinbase Ventures.",
    },
    strengths: [
      "Agents can sign themselves up with a funded account",
      "Wallet, email and LLM gateway in one identity",
      "Multi-chain",
    ],
    weaknesses: ["9 tools", "No documented spend caps or allowlists", "Prices not published per tool"],
    backing: "$19.2M seed, Primary and ParaFi",
  },
  {
    id: "agentcash",
    name: "AgentCash",
    url: "https://agentcash.dev",
    oneLiner: "One USDC balance for thousands of x402 and MPP APIs, with a CLI and a skill.",
    claimedTools: 3200,
    publicTools: null,
    providers: null,
    evidence: "docs",
    scores: { catalog: 3, pricing: 2, controls: 1, access: 3, rails: 3, reliability: 1, maturity: 4 },
    why: {
      catalog: "Claims 3,200+ APIs drawn from any x402 or MPP merchant. Quality varies.",
      pricing: "A generous $25 starting credit; fees not published.",
      controls: "No documented spend controls.",
      access: "CLI and skill. MCP is a local extension, not a hosted server.",
      rails: "USDC through x402 and MPP.",
      reliability: "No documented quotes or receipts.",
      maturity: "$10M seed led by a16z; claims 1.5M+ paid calls.",
    },
    strengths: ["Reaches any x402 or MPP merchant", "$25 to start", "a16z-backed; claims 1.5M+ paid calls"],
    weaknesses: ["USDC only", "No documented controls, quotes or receipts", "No hosted remote MCP"],
    backing: "$10M seed, a16z",
  },
  {
    id: "anyway",
    name: "Anyway",
    url: "https://anyway.sh/agents",
    oneLiner: "An agent wallet in USDC on Base and an x402 marketplace with a per-transaction cap.",
    claimedTools: 193,
    publicTools: 193,
    providers: 37,
    evidence: "measured",
    scores: { catalog: 1, pricing: 3, controls: 2, access: 3, rails: 3, reliability: 3, maturity: 2 },
    why: {
      catalog: "193 endpoints from 37 providers in a public directory; only 10 providers were healthy when we fetched it.",
      pricing: "From $0.001, with quote and confirm before signing.",
      controls: "A per-transaction cap only; no cumulative budget.",
      access: "CLI, REST and skill.md. No MCP server.",
      rails: "USDC on Base, or card-funded credits that are not refundable.",
      reliability: "Quote then confirm, and a trace per purchase.",
      maturity: "Early; a multimillion-dollar investment from Sky9 per the site.",
    },
    strengths: ["Agent wallet kept apart from main funds", "Quote and confirm before signing", "Can pay any x402 endpoint"],
    weaknesses: ["Small catalog, 27 of 37 providers unhealthy at fetch", "Per-transaction cap only", "No MCP server"],
    backing: "Sky9 Capital",
  },
];

export const ALSO_RAN = [
  { name: "Arcade.dev", why: "Runs tools on the user's own authorized accounts; no shared wallet. Acquired Smithery in August 2026." },
  { name: "Smithery", why: "Hosted connections shut down on 31 October 2026; the directory stays." },
  { name: "Skyfire", why: "Identity and payment credentials for agents, without a tool catalog." },
  { name: "Payman", why: "Pivoted to banking agents for community banks and credit unions." },
  { name: "Crossmint", why: "Stablecoin wallets and payment APIs, without a paid-tool catalog." },
  { name: "Natural", why: "Payment rails between agents, businesses and consumers." },
  { name: "Paid", why: "Billing for companies that sell agents, not for agents that buy tools." },
  { name: "Toolhouse", why: "Repositioned as AI workers." },
  { name: "Pipedream Connect", why: "Managed auth for 10,000+ tools on the user's own accounts; no wallet." },
  { name: "x402scan", why: "An explorer for x402 payments; covered through AgentCash." },
  { name: "Composio core", why: "Covered under Composio Instant." },
];

export const O11_SOURCES = [
  { label: "From Treg's catalog", value: 3949 },
  { label: "Authored by o11", value: 2760 },
  { label: "From AgentMuxer", value: 1463 },
];

export const O11_SAMPLE = {
  n: 240,
  liveChecked: 0,
  numericPricePct: 60,
  medianPaidUsd: 0.0015,
  p10Usd: 0.001,
  p90Usd: 0.06,
  priceBasis: [
    { label: "Variable", value: 172 },
    { label: "Free", value: 45 },
    { label: "Per call", value: 23 },
  ],
  topProviders: [
    { name: "tikhub", tools: 1900 },
    { name: "dataforseo", tools: 458 },
    { name: "anyapi", tools: 397 },
    { name: "justoneapi", tools: 272 },
    { name: "api-strale-io", tools: 197 },
  ],
};

export const FEATURES: { label: string; key: string }[] = [
  { key: "mcp", label: "Remote MCP" },
  { key: "cli", label: "CLI" },
  { key: "sdk", label: "Language SDK" },
  { key: "skill", label: "skill.md" },
  { key: "publicCatalog", label: "Public catalog" },
  { key: "quote", label: "Quote before call" },
  { key: "idempotency", label: "Idempotency keys" },
  { key: "failedFree", label: "Failed calls free" },
  { key: "agentCaps", label: "Per-agent caps" },
  { key: "allowlist", label: "Tool allowlist" },
  { key: "approvals", label: "Human approvals" },
  { key: "byo", label: "Your own accounts" },
  { key: "fiat", label: "Card or USD" },
  { key: "crypto", label: "Stablecoin or x402" },
];

// true = documented, false = documented absent or not found, null = unclear.
export const FEATURE_MATRIX: Record<string, Record<string, boolean | null>> = {
  o11: { mcp: true, cli: true, sdk: true, skill: true, publicCatalog: true, quote: true, idempotency: true, failedFree: false, agentCaps: true, allowlist: true, approvals: true, byo: true, fiat: true, crypto: false },
  treg: { mcp: true, cli: true, sdk: false, skill: true, publicCatalog: true, quote: true, idempotency: true, failedFree: true, agentCaps: true, allowlist: true, approvals: false, byo: true, fiat: true, crypto: false },
  monid: { mcp: true, cli: true, sdk: false, skill: true, publicCatalog: false, quote: true, idempotency: false, failedFree: true, agentCaps: false, allowlist: false, approvals: false, byo: false, fiat: true, crypto: true },
  locus: { mcp: true, cli: true, sdk: true, skill: null, publicCatalog: false, quote: null, idempotency: true, failedFree: null, agentCaps: true, allowlist: true, approvals: null, byo: true, fiat: true, crypto: true },
  x402: { mcp: false, cli: true, sdk: true, skill: true, publicCatalog: true, quote: true, idempotency: null, failedFree: null, agentCaps: true, allowlist: null, approvals: null, byo: false, fiat: false, crypto: true },
  nevermined: { mcp: true, cli: null, sdk: true, skill: null, publicCatalog: null, quote: null, idempotency: null, failedFree: null, agentCaps: true, allowlist: null, approvals: null, byo: null, fiat: true, crypto: true },
  orthogonal: { mcp: true, cli: true, sdk: true, skill: true, publicCatalog: true, quote: true, idempotency: false, failedFree: null, agentCaps: null, allowlist: null, approvals: null, byo: null, fiat: true, crypto: true },
  composio: { mcp: true, cli: true, sdk: true, skill: true, publicCatalog: null, quote: false, idempotency: null, failedFree: true, agentCaps: false, allowlist: true, approvals: false, byo: true, fiat: true, crypto: false },
  atxp: { mcp: true, cli: true, sdk: true, skill: true, publicCatalog: null, quote: null, idempotency: null, failedFree: null, agentCaps: null, allowlist: null, approvals: null, byo: false, fiat: true, crypto: true },
  agentcash: { mcp: false, cli: true, sdk: false, skill: true, publicCatalog: null, quote: null, idempotency: null, failedFree: null, agentCaps: null, allowlist: null, approvals: null, byo: false, fiat: false, crypto: true },
  anyway: { mcp: null, cli: true, sdk: false, skill: true, publicCatalog: true, quote: true, idempotency: null, failedFree: null, agentCaps: true, allowlist: null, approvals: null, byo: null, fiat: true, crypto: true },
};

export const PRESETS = [
  { id: "balanced", label: "Balanced", weights: { catalog: 1, pricing: 1, controls: 1, access: 1, rails: 1, reliability: 1, maturity: 1 } },
  { id: "builder", label: "Shipping an agent today", weights: { catalog: 2, pricing: 1, controls: 1, access: 2, rails: 0.5, reliability: 1.5, maturity: 2 } },
  { id: "finance", label: "Finance and governance", weights: { catalog: 0.5, pricing: 1.5, controls: 2.5, access: 0.5, rails: 1, reliability: 2, maturity: 1.5 } },
  { id: "crypto", label: "Crypto-native agents", weights: { catalog: 1, pricing: 1, controls: 0.5, access: 1, rails: 2.5, reliability: 1, maturity: 1 } },
] as const satisfies readonly { id: string; label: string; weights: Scores }[];

/** Weighted score out of 100. */
export const weightedScore = (scores: Scores, weights: Scores) => {
  let total = 0;
  let max = 0;
  for (const { key } of DIMENSIONS) {
    total += scores[key] * weights[key];
    max += 5 * weights[key];
  }
  return Math.round((total / max) * 100);
};
