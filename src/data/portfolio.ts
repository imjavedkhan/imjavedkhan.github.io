// ============================================================
// Portfolio content. Edit values below to customise.
// ============================================================

export const profile = {
  name: "Javed Ali Khan",
  initials: "JAK",
  role: "Senior Software Engineer",
  tagline: "Java, Spring Boot, microservices & cloud-native backends.",
  location: "Noida, UP, IN",
  email: "javedalikhan50@gmail.com",
  github: "https://github.com/imjavedkhan",
  linkedin: "https://linkedin.com/in/javedalikhan",
  twitter: "https://x.com/ijavedalikhan",
  resumeUrl: "https://drive.google.com/file/d/1wVNbhdN885fo1v1xes-Hqsm_wbFiuTgN/view?usp=sharing",
  rssFeedUrl: "https://medium.com/feed/@javedalikhan50",
  // Toggle to show/hide the "Available for hire" badge in the Hero section.
  availableForHire: false,
  // Customisable availability line shown inside the Hero badge (e.g. "Open to new roles").
  availabilityText: "Open to new roles · remote or Noida/Delhi NCR",
};

export const stats = [
  { label: "yrs shipping", value: "6+" },
  { label: "companies", value: "3" },
  { label: "latency cut", value: "30%" },
  { label: "java jump", value: "8→17" },
];

export const aboutLines = [
  "I build the parts of software you never see — the parts that don't get to crash.",
  "Currently writing Java and Spring Boot against PostgreSQL, Redis, and the JVM at Gigaforce.",
  "Previously: enterprise REST services at Cognizant and TCS, shipped via Jenkins CI/CD.",
  "I care about clean APIs, observable systems, and code that survives the next migration.",
];

export type SkillGroup = {
  label: string;
  items: { name: string; level: number /* 1-5 */ }[];
};

export const skills: SkillGroup[] = [
  {
    label: "languages",
    items: [
      { name: "Java", level: 5 },
      { name: "Python", level: 3 },
      { name: "SQL", level: 4 },
      { name: "HTML", level: 3 },
    ],
  },
  {
    label: "frameworks",
    items: [
      { name: "Spring Boot", level: 5 },
      { name: "Microservices", level: 5 },
      { name: "Hibernate", level: 4 },
      { name: "REST APIs", level: 5 },
    ],
  },
  {
    label: "datastores",
    items: [
      { name: "PostgreSQL", level: 5 },
      { name: "Redis", level: 4 },
      { name: "SQL", level: 4 },
    ],
  },
  {
    label: "cloud",
    items: [
      { name: "AWS", level: 4 },
      { name: "Azure", level: 4 },
      { name: "Cloud Computing", level: 4 },
    ],
  },
  {
    label: "devops",
    items: [
      { name: "Docker", level: 4 },
      { name: "Jenkins", level: 4 },
      { name: "CI/CD", level: 5 },
      { name: "Git", level: 5 },
      { name: "Agile", level: 5 },
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
    company: "Gigaforce",
    role: "Senior Software Engineer",
    range: "Apr 2023 — present",
    location: "Noida",
    bullets: [
      "feat(auth): migrated microservices Java 8 → 17, refactored Spring Boot auth modules",
      "perf(redis): added caching + token verification, -30% response time",
      "feat(outlook): integrated Outlook Inbox API for incoming mail reading and responding",
      "chore(infra): containerized microservices and databases for deployment",
      "docs(api): wrote technical specs and optimized DB + API models for scale",
    ],
    stack: ["Java 17", "Spring Boot", "Redis", "PostgreSQL", "Docker"],
  },
  {
    company: "Cognizant",
    role: "Software Engineer",
    range: "Sep 2022 — Mar 2023",
    location: "Noida",
    bullets: [
      "feat(api): built and deployed Spring Boot REST APIs to customer spec",
      "chore(cicd): supported builds and deployments across environments",
      "fix(review): contributed to code reviews, bug fixes, and perf improvements",
      "docs(agile): active in sprint planning and retrospectives",
    ],
    stack: ["Java", "Spring Boot", "REST", "Git"],
  },
  {
    company: "Tata Consultancy Services",
    role: "Developer",
    range: "Jun 2019 — Aug 2022",
    location: "Pune",
    bullets: [
      "feat(api): designed and shipped Spring Boot REST APIs to industry standards",
      "chore(jenkins): delivered user stories to prod via Jenkins CI/CD pipelines",
      "fix(rca): root-cause analysis on production defects, drove reliability up",
      "docs(sdlc): owned design → dev → perf testing → release end-to-end",
    ],
    stack: ["Java", "Spring Boot", "Jenkins", "SQL"],
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
    slug: "spring-ai-rag",
    title: "spring-ai-rag",
    summary:
      "Spring AI POC for Retrieval-Augmented Generation. Ingests documents (PDF/DOC/images) via Tika, embeds with nomic-embed-text on Ollama, stores vectors in Postgres pgvector (HNSW + cosine), and answers queries with llama3.2 augmented by retrieved context. Includes LLaVA-powered image classification.",
    stack: ["Java 17", "Spring Boot 3.5", "Spring AI 1.0", "Ollama", "pgvector", "Tika", "Docker"],
    metrics: [
      { label: "llm", value: "llama3.2" },
      { label: "embed", value: "nomic" },
      { label: "index", value: "hnsw/cos" },
    ],
    diagram: `flowchart LR
  U[client] --> API[spring boot :8081]
  API -->|upload| T[tika parser]
  T --> SP[token splitter]
  SP --> EMB[ollama nomic-embed-text]
  EMB --> PG[(postgres pgvector)]
  API -->|ask| RW[rewrite query]
  RW --> RET[vector retriever]
  RET --> PG
  RET --> CTX[context]
  CTX --> LLM[ollama llama3.2]
  LLM --> API
  IMG[image] --> LLAVA[ollama llava]
  LLAVA --> CLS[classifier]`,
    code: {
      lang: "java",
      title: "RagController.java",
      body: `@RestController
@RequestMapping("/api/rag")
public class RagController {
    private final ChatClient chat;
    private final VectorStore store;

    @PostMapping("/upload")
    public ResponseEntity<Void> upload(@RequestParam MultipartFile file) {
        var docs = new TikaDocumentReader(file.getResource()).get();
        var chunks = new TokenTextSplitter().apply(docs);
        store.add(chunks);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String query) {
        return chat.prompt()
            .advisors(new QuestionAnswerAdvisor(store))
            .user(query)
            .call()
            .content();
    }
}`,
    },
    repo: "https://github.com/imjavedkhan/spring_ai_rag",
  },
  {
    slug: "spring-ai-rag-fe",
    title: "spring-ai-rag-fe",
    summary:
      "React + Vite frontend for the Spring AI RAG backend. Dashboard for AI chat, document upload (PDF/TXT/DOCX) into the RAG knowledge base, document classification, manual embedding generation, and direct content-store inserts. Talks to Spring Boot at :8081 over Axios.",
    stack: ["React 18", "Vite", "Tailwind CSS", "React Router 7", "Axios", "Lucide"],
    metrics: [
      { label: "pages", value: "5" },
      { label: "api", value: ":8081" },
      { label: "router", value: "v7" },
    ],
    diagram: `flowchart LR
  U[user] --> UI[react + vite :5173]
  UI --> R[react-router v7]
  R --> P1[ChatWithAI]
  R --> P2[UploadDocument]
  R --> P3[DocumentClassifier]
  R --> P4[GenerateEmbedding]
  R --> P5[AddContent]
  P1 -->|axios| API[spring boot :8081]
  P2 -->|axios| API
  P3 -->|axios| API
  P4 -->|axios| API
  P5 -->|axios| API
  API --> PG[(pgvector)]
  API --> LLM[ollama llama3.2 / llava]`,
    code: {
      lang: "jsx",
      title: "ChatWithAI.jsx",
      body: `export default function ChatWithAI() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = async () => {
    const { data } = await axios.get(
      "http://localhost:8081/api/rag/ask",
      { params: { query } }
    );
    setAnswer(data);
  };

  return (
    <Card>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button onClick={ask}>Ask</Button>
      <pre>{answer}</pre>
    </Card>
  );
}`,
    },
    repo: "https://github.com/imjavedkhan/spring_ai_rag_FE",
  },
  {
    slug: "auth-service",
    title: "auth-service",
    summary:
      "Spring Boot authentication & authorization service migrated from Java 8 to Java 17. Adds Redis-backed token verification and Salesforce SSO across platforms.",
    stack: ["Java 17", "Spring Boot", "Redis", "PostgreSQL"],
    metrics: [
      { label: "latency cut", value: "30%" },
      { label: "java", value: "17" },
      { label: "sso", value: "salesforce" },
    ],
    diagram: `flowchart LR
  U[client] -->|JWT| G[api gateway]
  G --> A[auth-service]
  A --> R[(redis cache)]
  A --> P[(postgres)]
  A -->|SAML| S[salesforce sso]
  A --> M[metrics]`,
    code: {
      lang: "java",
      title: "AuthService.java",
      body: `@Service
public class AuthService {
    private final RedisTemplate<String, String> redis;
    private final JwtParser parser;

    public Authentication verify(String token) {
        String cached = redis.opsForValue().get("tok:" + token);
        if (cached != null) return Authentication.of(cached);

        Claims claims = parser.parseClaimsJws(token).getBody();
        redis.opsForValue().set("tok:" + token, claims.getSubject(),
                Duration.ofMinutes(5));
        return Authentication.of(claims.getSubject());
    }
}`,
    },
    repo: "https://github.com/imjavedkhan",
  },
  {
    slug: "microservices-platform",
    title: "microservices-platform",
    summary:
      "Containerized Spring Boot microservices platform with REST APIs, optimized data models, and database-backed scalability. Deployed via Docker.",
    stack: ["Java", "Spring Boot", "Docker", "PostgreSQL"],
    metrics: [
      { label: "services", value: "12+" },
      { label: "uptime", value: "99.9%" },
      { label: "deploy", value: "docker" },
    ],
    diagram: `flowchart TB
  C[client] --> G[gateway]
  G --> S1[orders-svc]
  G --> S2[users-svc]
  G --> S3[billing-svc]
  S1 --> DB[(postgres)]
  S2 --> DB
  S3 --> DB
  S1 --> R[(redis)]`,
    code: {
      lang: "java",
      title: "OrderController.java",
      body: `@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService service;

    @PostMapping
    public ResponseEntity<OrderDto> create(@Valid @RequestBody OrderRequest req) {
        Order saved = service.create(req);
        return ResponseEntity
                .created(URI.create("/api/v1/orders/" + saved.getId()))
                .body(OrderDto.from(saved));
    }
}`,
    },
    repo: "https://github.com/imjavedkhan",
  },
  {
    slug: "cicd-pipeline",
    title: "cicd-pipeline",
    summary:
      "Jenkins-based CI/CD pipeline for Spring Boot services. Automates build, test, containerization, and rolling deploys to AWS / Azure.",
    stack: ["Jenkins", "Docker", "AWS", "Azure"],
    metrics: [
      { label: "stories shipped", value: "200+" },
      { label: "build time", value: "4m" },
      { label: "rollback", value: "1-click" },
    ],
    diagram: `flowchart LR
  D[dev push] --> J[jenkins]
  J --> T[unit tests]
  T --> B[maven build]
  B --> I[docker image]
  I --> REG[(registry)]
  REG --> K[deploy aws/azure]`,
    code: {
      lang: "groovy",
      title: "Jenkinsfile",
      body: `pipeline {
  agent any
  stages {
    stage('Build') { steps { sh 'mvn -B clean package' } }
    stage('Test')  { steps { sh 'mvn test' } }
    stage('Image') {
      steps { sh 'docker build -t app:\${BUILD_NUMBER} .' }
    }
    stage('Deploy') {
      steps { sh './deploy.sh \${BUILD_NUMBER}' }
    }
  }
}`,
    },
    repo: "https://github.com/imjavedkhan",
  },
];

export type EducationItem = {
  school: string;
  degree: string;
  range: string;
  notes?: string;
  certificateUrl?: string; // optional link to degree/transcript certificate
};

export const education: EducationItem[] = [
  {
    school: "Galgotias University",
    degree: "B.Tech, Computer Science & Engineering",
    range: "2015 — 2019",
    notes: "GPA: 7.5 / 10.",
    certificateUrl: "https://drive.google.com/file/d/10nZlZ_4SSu5vmPB6oWxOME1--Oil0SXN/view?usp=sharing",
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
    name: "Machine Learning Specialization",
    issuer: "Coursera",
    date: "—",
    url: "https://coursera.org/share/17f6bf990beb99f79289f8b26cfe0582",
  },
  {
    name: "Spring Security",
    issuer: "Udemy",
    date: "—",
    url: "https://drive.google.com/file/d/1pNsHVU-EDifRnbKPogNY8pZg87nxmN4m/view?usp=sharing",
  },
  {
    name: "Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    date: "—",
    url: "https://www.credly.com/badges/ee435bb9-a31f-4a22-a6a3-91522f95cbaf/public_url",
  },
  {
    name: "AWS Accreditation Certificate",
    issuer: "Amazon Web Services",
    date: "—",
    url: "https://www.credly.com/badges/7289a2d7-a82b-403f-80f4-76f37f9e6b7b/public_url",
  },
];
