export const CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.1-flash-lite',
};

export const QUIZ_TITLE = 'AI Awareness Quiz';
export const QUIZ_SUBTITLE =
  'Five rounds on the real state of AI in 2026 — platforms, enterprise spend, countries, industries, and the tools running inside the Big Four. Speak your answers, no typing.';

export const ROUNDS = [
  {
    id: 1,
    title: 'Platform Adoption',
    question: 'Which AI platforms have the largest active user bases globally in 2026?',
    insight:
      "Claude, Copilot, and Perplexity — the names people usually guess — don't make the top 5 on this metric. Copilot's real scale (~420M) comes almost entirely from being bundled into Microsoft 365, not standalone use. Two of the top 5 (Doubao, Qwen) are Chinese platforms most people have never heard of.",
    concepts: [
      {
        id: 1,
        rank: 1,
        label: 'ChatGPT',
        description:
          "OpenAI's ChatGPT, the most-used standalone AI chatbot app worldwide, with roughly 995 million to 1.1 billion monthly active users.",
        keywords: ['chatgpt', 'chat gpt', 'gpt', 'openai'],
        source: 'OpenAI / Sensor Tower',
      },
      {
        id: 2,
        rank: 2,
        label: 'Meta AI',
        description:
          "Meta's AI assistant built into Facebook, Instagram, and WhatsApp, with roughly 1 billion monthly active users.",
        keywords: ['meta ai', 'meta', 'facebook ai', 'instagram ai', 'whatsapp ai'],
        source: 'Meta earnings disclosure',
      },
      {
        id: 3,
        rank: 3,
        label: 'Gemini',
        description:
          "Google's Gemini assistant, which Google announced had surpassed 900 million monthly active users at I/O 2026 (up from 400M the year before).",
        keywords: ['gemini', 'google ai', 'google gemini', 'bard'],
        source: 'Google I/O 2026 — Sundar Pichai on stage',
      },
      {
        id: 4,
        rank: 4,
        label: 'Doubao',
        description:
          "ByteDance's Doubao AI assistant, one of China's most-used AI apps with roughly 330 to 382 million monthly users.",
        keywords: ['doubao', 'bytedance', 'tiktok ai'],
        source: 'QuestMobile H1 2026',
      },
      {
        id: 5,
        rank: 5,
        label: 'Qwen',
        description:
          "Alibaba's Qwen AI assistant, a fast-growing Chinese AI platform with roughly 167 to 251 million monthly users.",
        keywords: ['qwen', 'alibaba'],
        source: 'QuestMobile (wide range — mostly launch-base growth)',
      },
    ],
  },
  {
    id: 2,
    title: 'Enterprise Adoption',
    question: 'Which AI platforms hold the largest share of enterprise and business spend in 2026?',
    insight:
      "This ranking structurally excludes China — Chinese enterprises run a parallel stack (Alibaba Cloud/Qwen, Baidu ERNIE, Tencent Cloud), with 346 licensed generative AI services registered domestically. It's an \"ex-China enterprise AI\" ranking, not a truly global one.",
    concepts: [
      {
        id: 1,
        rank: 1,
        label: 'OpenAI',
        description:
          'OpenAI/ChatGPT, used by roughly 85% of mid-market and enterprise firms and deployed at 92% of the Fortune 500.',
        keywords: ['openai', 'chatgpt', 'gpt'],
        source: 'Yipit (~1,000-company panel); OpenAI-disclosed',
      },
      {
        id: 2,
        rank: 2,
        label: 'Anthropic / Claude',
        description:
          'Anthropic\'s Claude, at roughly 55% enterprise adoption and rising fast — a customer at 8 of the Fortune 10 — now edging ahead of OpenAI on actual spend (34.4% vs 32.3% enterprise wallet share) and holding roughly 54% share of enterprise coding workloads specifically.',
        keywords: ['anthropic', 'claude'],
        source: 'Ramp 2026 (wallet share); Menlo Ventures (coding workloads)',
      },
      {
        id: 3,
        rank: 3,
        label: 'Google Gemini / Vertex',
        description:
          "Google's Gemini and Vertex AI platform, holding roughly 17 to 21 percent of enterprise AI spend.",
        keywords: ['google', 'gemini', 'vertex', 'vertex ai'],
        source: 'Presenc AI, Q1 2026',
      },
      {
        id: 4,
        rank: 4,
        label: 'Microsoft Copilot',
        description:
          'Microsoft Copilot, with over 15 million paid seats inside the 400-million-plus Microsoft 365 installed base.',
        keywords: ['copilot', 'microsoft', 'microsoft 365', 'office copilot'],
        source: 'Microsoft disclosure',
      },
      {
        id: 5,
        rank: 5,
        label: 'AWS Bedrock / Azure AI',
        description:
          "Amazon's Bedrock and Microsoft's Azure AI platforms combined, accounting for roughly 11 percent of enterprise AI spend.",
        keywords: ['aws', 'bedrock', 'azure', 'azure ai', 'amazon'],
        source: 'Presenc AI, Q1 2026',
      },
    ],
  },
  {
    id: 3,
    title: 'Countries',
    question: 'Which countries have the highest absolute number of active AI users in 2026?',
    insight:
      "Most \"top countries\" lists only count ChatGPT, which is blocked in China — making China invisible in Western-sourced rankings despite having the largest domestic AI user base on earth. Good example of reading stats critically.",
    concepts: [
      {
        id: 1,
        rank: 1,
        label: 'China',
        description:
          'China has the largest domestic AI user base in the world, around 602 million users (six-month-usage measure), driven by apps like Doubao, Qwen, DeepSeek, Ernie, and Yuanbao.',
        keywords: ['china', 'chinese'],
        source: 'CNNIC',
      },
      {
        id: 2,
        rank: 2,
        label: 'United States',
        description:
          'The United States, with roughly 205 million or more ChatGPT users alone — higher still when counting Gemini, Meta AI, and Copilot.',
        keywords: ['united states', 'usa', 'america', 'us'],
        source: 'Compiled figures',
      },
      {
        id: 3,
        rank: 3,
        label: 'India',
        description:
          "India, the fastest-growing major ChatGPT market (up 41% YoY), with around 198 to 200 million active AI users, and the world's #1 self-reported AI usage rate by one measure (92%).",
        keywords: ['india', 'indian'],
        source: 'Compiled figures; Adobe-sponsored measure',
      },
      {
        id: 4,
        rank: 4,
        label: 'Brazil',
        description: 'Brazil, with roughly 70 million active AI users.',
        keywords: ['brazil', 'brazilian'],
        source: 'Compiled figures',
      },
      {
        id: 5,
        rank: 5,
        label: 'Canada',
        description: 'Canada, with roughly 65 million active AI users and the highest prompts-per-capita of any country.',
        keywords: ['canada', 'canadian'],
        source: 'Compiled figures',
      },
    ],
  },
  {
    id: 4,
    title: 'Industry Adoption',
    question: 'Which industries show the highest rate of AI adoption in 2026?',
    insight:
      "Financial services isn't just adopting AI, it's the sector furthest along in actually running AI agents in live production — directly reinforcing why the entry-level job ladder is shifting fastest in this field.",
    concepts: [
      {
        id: 1,
        rank: 1,
        label: 'Technology & Software',
        description:
          'The technology and software industry, with the highest AI adoption of any sector at roughly 88 to 92 percent of firms.',
        keywords: ['technology', 'software', 'tech industry'],
        source: 'McKinsey / Presenc AI',
      },
      {
        id: 2,
        rank: 2,
        label: 'Financial Services',
        description:
          'Financial services, adopted by 72 to 84 percent of firms and leading all industries in moving AI agents into actual production (not just pilots) — 47% of banking and insurance firms.',
        keywords: ['financial services', 'finance', 'banking', 'insurance'],
        source: 'McKinsey',
      },
      {
        id: 3,
        rank: 3,
        label: 'Professional Services',
        description: 'Professional services such as consulting and law, close behind financial services in AI adoption.',
        keywords: ['professional services', 'consulting', 'law', 'legal'],
        source: 'Compiled figures',
      },
      {
        id: 4,
        rank: 4,
        label: 'Media & Publishing',
        description: 'Media and publishing, with roughly 78 percent AI adoption.',
        keywords: ['media', 'publishing', 'journalism'],
        source: 'Compiled figures',
      },
      {
        id: 5,
        rank: 5,
        label: 'Retail / E-commerce',
        description: 'Retail and e-commerce, an industry accelerating AI adoption fast through 2025 and 2026.',
        keywords: ['retail', 'e-commerce', 'ecommerce', 'online shopping'],
        source: 'McKinsey, Deloitte',
      },
    ],
  },
  {
    id: 5,
    title: 'Firm AI Tools',
    question:
      'Which proprietary AI agents have the major professional services firms built for accounting and consulting work?',
    insight:
      "Every major firm shipped an internal AI assistant on roughly the same 2023–24 timeline — these tools are now table stakes, not a differentiator. The real competitive edge has shifted to who governs and audits AI use, not who has the tool.",
    runnersUp: [
      'Bain — exclusive OpenAI partnership',
      'Accenture AI Refinery — $3B commitment, ~77,000 AI staff (largest scale play)',
      "PwC's GL.ai — built with H2O.ai, journal-entry review specifically",
    ],
    concepts: [
      {
        id: 1,
        rank: 1,
        label: 'ChatPwC (PwC)',
        description:
          "PwC's ChatPwC, the largest single-firm GenAI rollout by seat count at about 200,000 users; PwC is also OpenAI's largest enterprise customer and official reseller.",
        keywords: ['chatpwc', 'pwc'],
        source: 'PwC disclosure',
      },
      {
        id: 2,
        rank: 2,
        label: 'EYQ / Helix (EY)',
        description:
          "EY's EYQ and Helix, audit-focused AI tools including a sovereign, on-prem AI Factory built with NVIDIA for regulated clients.",
        keywords: ['eyq', 'helix', 'ey', 'ernst young'],
        source: 'EY disclosure',
      },
      {
        id: 3,
        rank: 3,
        label: 'Zora AI / PairD (Deloitte)',
        description:
          "Deloitte's Zora AI (built with Nvidia) handles invoice automation and trend commentary; PairD is the internal consultant assistant.",
        keywords: ['zora', 'paird', 'deloitte'],
        source: 'Deloitte disclosure',
      },
      {
        id: 4,
        rank: 4,
        label: 'Ignite / Workbench (KPMG)',
        description:
          "KPMG's Ignite and Workbench platforms, backed by $2B committed over 5 years, targeting $12B in AI-enabled revenue, and the only firm with a published ISO/IEC 42001-aligned governance framework.",
        keywords: ['ignite', 'workbench', 'kpmg'],
        source: 'KPMG disclosure',
      },
      {
        id: 5,
        rank: 5,
        label: 'Lilli (McKinsey)',
        description:
          "McKinsey's Lilli assistant, used in about 70 percent of consultants' daily work and credited with cutting ~30% of \"drudge time.\"",
        keywords: ['lilli', 'mckinsey'],
        source: 'McKinsey disclosure',
      },
    ],
  },
];

export const SOURCE_NOTE =
  'Figures compiled from: OpenAI, Meta, Alphabet (Q1/Q2 2026 earnings, Google I/O 2026), QuestMobile H1 2026, CNNIC, Ramp 2026 enterprise spend data, Menlo Ventures, Yipit, McKinsey State of AI, Presenc AI, KPMG AI in Finance 2026, Deloitte Finance Trends 2026, Stan Ventures State of AI (July 2026). Cross-checked against at least two independent sources per figure; ranges given where sources materially disagree.';
