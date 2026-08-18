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
    concepts: [
      {
        id: 1,
        label: 'ChatGPT',
        description:
          "OpenAI's ChatGPT, the most-used standalone AI chatbot app worldwide, with roughly 1 billion monthly active users.",
        keywords: ['chatgpt', 'chat gpt', 'gpt', 'openai'],
      },
      {
        id: 2,
        label: 'Meta AI',
        description:
          "Meta's AI assistant built into Facebook, Instagram, and WhatsApp, with roughly 1 billion monthly active users.",
        keywords: ['meta ai', 'meta', 'facebook ai', 'instagram ai', 'whatsapp ai'],
      },
      {
        id: 3,
        label: 'Gemini',
        description:
          "Google's Gemini assistant, which Google announced had surpassed 900 million monthly active users at I/O 2026.",
        keywords: ['gemini', 'google ai', 'google gemini', 'bard'],
      },
      {
        id: 4,
        label: 'Doubao',
        description:
          "ByteDance's Doubao AI assistant, one of China's most-used AI apps with hundreds of millions of monthly users.",
        keywords: ['doubao', 'bytedance', 'tiktok ai'],
      },
      {
        id: 5,
        label: 'Qwen',
        description:
          "Alibaba's Qwen AI assistant, a fast-growing Chinese AI platform with well over 100 million monthly users.",
        keywords: ['qwen', 'alibaba'],
      },
    ],
  },
  {
    id: 2,
    title: 'Enterprise Adoption',
    question: 'Which AI platforms hold the largest share of enterprise and business spend in 2026?',
    concepts: [
      {
        id: 1,
        label: 'OpenAI',
        description:
          'OpenAI/ChatGPT, used by roughly 85% of mid-market and enterprise firms and deployed at 92% of the Fortune 500.',
        keywords: ['openai', 'chatgpt', 'gpt'],
      },
      {
        id: 2,
        label: 'Anthropic / Claude',
        description:
          "Anthropic's Claude, now edging ahead of OpenAI on enterprise wallet share and dominant in enterprise coding workloads.",
        keywords: ['anthropic', 'claude'],
      },
      {
        id: 3,
        label: 'Google Gemini / Vertex',
        description:
          "Google's Gemini and Vertex AI platform, holding roughly 17 to 21 percent of enterprise AI spend.",
        keywords: ['google', 'gemini', 'vertex', 'vertex ai'],
      },
      {
        id: 4,
        label: 'Microsoft Copilot',
        description:
          'Microsoft Copilot, with over 15 million paid seats inside the 400-million-plus Microsoft 365 installed base.',
        keywords: ['copilot', 'microsoft', 'microsoft 365', 'office copilot'],
      },
      {
        id: 5,
        label: 'AWS Bedrock / Azure AI',
        description:
          "Amazon's Bedrock and Microsoft's Azure AI platforms combined, accounting for roughly 11 percent of enterprise AI spend.",
        keywords: ['aws', 'bedrock', 'azure', 'azure ai', 'amazon'],
      },
    ],
  },
  {
    id: 3,
    title: 'Countries',
    question: 'Which countries have the highest absolute number of active AI users in 2026?',
    concepts: [
      {
        id: 1,
        label: 'China',
        description:
          'China has the largest domestic AI user base in the world, around 602 million users, driven by apps like Doubao, Qwen, and DeepSeek.',
        keywords: ['china', 'chinese'],
      },
      {
        id: 2,
        label: 'United States',
        description: 'The United States, with roughly 205 million or more ChatGPT users alone.',
        keywords: ['united states', 'usa', 'america', 'us'],
      },
      {
        id: 3,
        label: 'India',
        description: "India, the fastest-growing major ChatGPT market, with around 200 million active AI users.",
        keywords: ['india', 'indian'],
      },
      {
        id: 4,
        label: 'Brazil',
        description: 'Brazil, with roughly 70 million active AI users.',
        keywords: ['brazil', 'brazilian'],
      },
      {
        id: 5,
        label: 'Canada',
        description: 'Canada, with roughly 65 million active AI users and the highest prompts-per-capita of any country.',
        keywords: ['canada', 'canadian'],
      },
    ],
  },
  {
    id: 4,
    title: 'Industry Adoption',
    question: 'Which industries show the highest rate of AI adoption in 2026?',
    concepts: [
      {
        id: 1,
        label: 'Technology & Software',
        description:
          'The technology and software industry, with the highest AI adoption of any sector at roughly 88 to 92 percent of firms.',
        keywords: ['technology', 'software', 'tech industry'],
      },
      {
        id: 2,
        label: 'Financial Services',
        description:
          'Financial services, adopted by 72 to 84 percent of firms and the sector furthest along in running AI agents in live production.',
        keywords: ['financial services', 'finance', 'banking', 'insurance'],
      },
      {
        id: 3,
        label: 'Professional Services',
        description: 'Professional services such as consulting and law, close behind financial services in AI adoption.',
        keywords: ['professional services', 'consulting', 'law', 'legal'],
      },
      {
        id: 4,
        label: 'Media & Publishing',
        description: 'Media and publishing, with roughly 78 percent AI adoption.',
        keywords: ['media', 'publishing', 'journalism'],
      },
      {
        id: 5,
        label: 'Retail / E-commerce',
        description: 'Retail and e-commerce, an industry accelerating AI adoption fast through 2025 and 2026.',
        keywords: ['retail', 'e-commerce', 'ecommerce', 'online shopping'],
      },
    ],
  },
  {
    id: 5,
    title: 'Firm AI Tools',
    question:
      'Which proprietary AI agents have the major professional services firms built for accounting and consulting work?',
    concepts: [
      {
        id: 1,
        label: 'ChatPwC (PwC)',
        description: "PwC's ChatPwC, the largest single-firm GenAI rollout with about 200,000 users.",
        keywords: ['chatpwc', 'pwc'],
      },
      {
        id: 2,
        label: 'EYQ / Helix (EY)',
        description:
          "EY's EYQ and Helix, audit-focused AI tools including a sovereign on-prem AI Factory built with NVIDIA.",
        keywords: ['eyq', 'helix', 'ey', 'ernst young'],
      },
      {
        id: 3,
        label: 'Zora AI / PairD (Deloitte)',
        description: "Deloitte's Zora AI and PairD assistants, handling invoice automation and consultant support.",
        keywords: ['zora', 'paird', 'deloitte'],
      },
      {
        id: 4,
        label: 'Ignite / Workbench (KPMG)',
        description: "KPMG's Ignite and Workbench platforms, backed by a two billion dollar, five-year AI investment.",
        keywords: ['ignite', 'workbench', 'kpmg'],
      },
      {
        id: 5,
        label: 'Lilli (McKinsey)',
        description: "McKinsey's Lilli assistant, used in about 70 percent of consultants' daily work.",
        keywords: ['lilli', 'mckinsey'],
      },
    ],
  },
];
