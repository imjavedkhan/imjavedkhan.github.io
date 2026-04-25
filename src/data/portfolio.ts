// ============================================================
// Portfolio content. Edit values below to customise.
// ============================================================

export const profile = {
  name: "Javed Ali Khan",
  initials: "JAK",
  role: "Senior Backend Engineer",
  tagline: "Distributed systems, low-latency services, durable storage.",
  location: "Bengaluru, IN",
  email: "hello@javedalikhan.dev",
  github: "https://github.com/javed-ali-khan",
  linkedin: "https://linkedin.com/in/javed-ali-khan",
  twitter: "https://x.com/javedalikhan",
  resumeUrl: "/resume.pdf",
  rssFeedUrl: "https://medium.com/feed/@javedalikhan", // change to any RSS feed
};

export const stats = [
  { label: "yrs shipping", value: "9+" },
  { label: "services owned", value: "27" },
  { label: "p99 cut", value: "62%" },
  { label: "rps peak", value: "180k" },
];

export const aboutLines = [
  "I build the parts of software you never see, the parts that don't get to crash.",
  "Currently writing Go and Rust against Postgres, Kafka, and Kubernetes.",
  "Previously: payments infra at scale, search ranking pipelines, durable queues.",
  "I care about correctness under failure, observable systems, and code that ages well.",
];

export type SkillGroup = {
  label: string;
  items: { name: string; level: number /* 1-5 */ }[];
};

export const skills: SkillGroup[] = [
  {
    label: "languages",
    items: [
      { name: "Go", level: 5 },
      { name: "Rust", level: 4 },
      { name: "Python", level: 4 },
      { name: "TypeScript", level: 4 },
      { name: "C", level: 3 },
    ],
  },
  {
    label: "datastores",
    items: [
      { name: "PostgreSQL", level: 5 },
      { name: "Redis", level: 5 },
      { name: "Cassandra", level: 4 },
      { name: "ClickHouse", level: 3 },
      { name: "RocksDB", level: 3 },
    ],
  },
  {
    label: "messaging",
    items: [
      { name: "Kafka", level: 5 },
      { name: "NATS", level: 4 },
      { name: "RabbitMQ", level: 4 },
      { name: "gRPC", level: 5 },
    ],
  },
  {
    label: "infra",
    items: [
      { name: "Kubernetes", level: 5 },
      { name: "Terraform", level: 4 },
      { name: "AWS", level: 5 },
      { name: "GCP", level: 3 },
      { name: "Linux", level: 5 },
    ],
  },
  {
    label: "observability",
    items: [
      { name: "Prometheus", level: 5 },
      { name: "OpenTelemetry", level: 5 },
      { name: "Grafana", level: 5 },
      { name: "Jaeger", level: 4 },
    ],
  },
];

export type Experience = {
  company: string;
  role: string;
  range: string;
  location: string;
  bullets: string[]; // commit-log style
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: "Stratus Labs",
    role: "Staff Backend Engineer",
    range: "2023 — present",
    location: "Remote",
    bullets: [
      "feat(payments): cut p99 settlement from 1.4s → 530ms",
      "perf(kafka): rebalanced partitions, +3.4x throughput",
      "chore(infra): migrated 18 services to gRPC + mTLS",
    ],
    stack: ["Go", "Kafka", "Postgres", "K8s"],
  },
  {
    company: "Northwind Search",
    role: "Senior Backend Engineer",
    range: "2020 — 2023",
    location: "Bengaluru",
    bullets: [
      "feat(ranking): online learning loop, +11% CTR",
      "feat(index): hot-shard rebalancer, zero-downtime",
      "fix(query): bounded tail latency under p999",
    ],
    stack: ["Rust", "Cassandra", "ClickHouse"],
  },
  {
    company: "Indigo Cloud",
    role: "Backend Engineer",
    range: "2017 — 2020",
    location: "Bengaluru",
    bullets: [
      "feat(queue): durable job runner, exactly-once semantics",
      "feat(billing): metering pipeline, 30B events/mo",
      "docs(rfc): authored internal storage design RFC",
    ],
    stack: ["Python", "Postgres", "Redis"],
  },
];

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  diagram: string;        // mermaid source
  code: { lang: string; title: string; body: string };
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "ledger",
    title: "ledger-core",
    summary:
      "Append-only double-entry ledger with deterministic replay and snapshots. Powers fees, payouts, and reconciliation for a fintech.",
    stack: ["Go", "Postgres", "Kafka", "gRPC"],
    metrics: [
      { label: "tx/s", value: "42k" },
      { label: "p99", value: "8ms" },
      { label: "uptime", value: "99.99%" },
    ],
    diagram: `flowchart LR
  A[client] -->|gRPC| B[api]
  B --> C[(write log)]
  C --> D{partitioner}
  D --> E[shard-0]
  D --> F[shard-1]
  D --> G[shard-n]
  E --> H[(snapshot)]
  F --> H
  G --> H
  H --> I[reader]`,
    code: {
      lang: "go",
      title: "ledger/append.go",
      body: `func (l *Ledger) Append(ctx context.Context, e Entry) (Offset, error) {
    if err := e.Validate(); err != nil {
        return 0, fmt.Errorf("validate: %w", err)
    }
    seg := l.activeSegment()
    off, err := seg.WriteAtomic(ctx, e)
    if err != nil {
        return 0, l.failover(ctx, err)
    }
    l.metrics.Appended.Inc()
    return off, nil
}`,
    },
    repo: "https://github.com/javed-ali-khan/ledger-core",
  },
  {
    slug: "streamhouse",
    title: "streamhouse",
    summary:
      "Real-time analytics layer over Kafka + ClickHouse with backpressure, exactly-once writes, and SQL-style streaming joins.",
    stack: ["Rust", "Kafka", "ClickHouse"],
    metrics: [
      { label: "events/s", value: "180k" },
      { label: "lag p95", value: "120ms" },
      { label: "loss", value: "0" },
    ],
    diagram: `flowchart TB
  K[(kafka)] --> P[parser]
  P --> W[windower]
  W --> J[joiner]
  J --> S[(clickhouse)]
  J --> M[metrics]`,
    code: {
      lang: "rust",
      title: "src/window.rs",
      body: `pub async fn window<S: Stream<Item = Event>>(
    mut s: S,
    size: Duration,
) -> impl Stream<Item = Batch> {
    try_stream! {
        let mut buf = Vec::with_capacity(4096);
        let mut deadline = Instant::now() + size;
        while let Some(ev) = s.next().await {
            buf.push(ev);
            if Instant::now() >= deadline {
                yield Batch::from(std::mem::take(&mut buf));
                deadline = Instant::now() + size;
            }
        }
    }
}`,
    },
    repo: "https://github.com/javed-ali-khan/streamhouse",
  },
  {
    slug: "kvkit",
    title: "kvkit",
    summary:
      "Embeddable LSM key-value store with bloom filters, leveled compaction, and a pluggable WAL. Educational + production-shaped.",
    stack: ["Rust", "RocksDB-style", "no_std-friendly"],
    metrics: [
      { label: "writes/s", value: "310k" },
      { label: "read p99", value: "0.6ms" },
      { label: "WA", value: "4.2x" },
    ],
    diagram: `flowchart LR
  W[write] --> M[memtable]
  M -->|flush| L0[(L0 sstables)]
  L0 --> L1[(L1)]
  L1 --> L2[(L2)]
  R[read] --> M
  R --> L0
  R --> L1
  R --> L2`,
    code: {
      lang: "rust",
      title: "src/memtable.rs",
      body: `impl MemTable {
    pub fn put(&self, k: Bytes, v: Bytes) {
        self.map.insert(k.clone(), Entry::value(v));
        self.size.fetch_add(k.len() as u64, Ordering::Relaxed);
    }
    pub fn get(&self, k: &[u8]) -> Option<Bytes> {
        self.map.get(k).and_then(|e| e.value().clone())
    }
}`,
    },
    repo: "https://github.com/javed-ali-khan/kvkit",
  },
];

export type EducationItem = {
  school: string;
  degree: string;
  range: string;
  notes?: string;
};

export const education: EducationItem[] = [
  {
    school: "Indian Institute of Technology, Bombay",
    degree: "B.Tech, Computer Science & Engineering",
    range: "2013 — 2017",
    notes: "Thesis on log-structured storage. ACM-ICPC regional finalist.",
  },
  {
    school: "Coursera / Stanford",
    degree: "Specialization — Algorithms & Distributed Systems",
    range: "2019",
    notes: "Audited graduate-level CS courses on consensus & scheduling.",
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
};

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect — Professional",
    issuer: "Amazon Web Services",
    date: "2024",
    credentialId: "AWS-SAP-118842",
    url: "https://aws.amazon.com/verification",
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "CNCF / Linux Foundation",
    date: "2023",
    credentialId: "LF-CKA-7710",
    url: "https://training.linuxfoundation.org/certification/verify/",
  },
  {
    name: "HashiCorp Certified — Terraform Associate",
    issuer: "HashiCorp",
    date: "2022",
    credentialId: "HC-TF-44291",
  },
  {
    name: "Google Cloud Professional Cloud Architect",
    issuer: "Google Cloud",
    date: "2021",
    credentialId: "GCP-PCA-22118",
  },
];
