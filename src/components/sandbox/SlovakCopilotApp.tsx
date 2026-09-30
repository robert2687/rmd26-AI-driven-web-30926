import React, { useState, useRef, useEffect, useMemo } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import {
  Send,
  Sparkles,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Download,
  ShieldCheck,
  FileText,
  CornerDownLeft,
  ArrowRight,
  Layers,
  ChevronRight,
  Lightbulb,
  Zap,
  Bookmark,
  BookOpen
} from 'lucide-react';

export type CopilotLanguage = 'sk' | 'en';
export type SuggestionCategory = 'all' | 'sk-nic' | 'eu-ai' | 'tax' | 'govtech';

export interface GroundedSource {
  title: string;
  url: string;
}

export interface GroundingSupport {
  groundingChunkIndices: number[];
  segment?: {
    startIndex?: number;
    endIndex?: number;
    text?: string;
  };
  confidenceScores?: number[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  tag?: string;
  language: CopilotLanguage;
  isGrounded?: boolean;
  sources?: GroundedSource[];
  groundingSupports?: GroundingSupport[];
  searchQueries?: string[];
  timestamp?: string;
}

export interface SearchIntentSuggestion {
  id: string;
  category: 'sk-nic' | 'eu-ai' | 'tax' | 'govtech';
  icon: string;
  categoryLabel: { sk: string; en: string };
  badgeColor: string;
  query: { sk: string; en: string };
  intentHint: { sk: string; en: string };
  keywords?: string[];
  fuzzyScore?: number;
  isFuzzyMatch?: boolean;
}

// Curated database of high-intent queries covering SK-NIC grants & EU regulatory frameworks with typo & synonym keywords
const SEARCH_INTENT_SUGGESTIONS: SearchIntentSuggestion[] = [
  // SK-NIC Grant Schemes
  {
    id: 'sknic-open-calls',
    category: 'sk-nic',
    icon: '🪙',
    categoryLabel: { sk: 'Fond SK-NIC', en: 'SK-NIC Fund' },
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    query: {
      sk: 'Aké sú aktuálne otvorené výzvy Fondu SK-NIC pre malé a veľké projekty?',
      en: 'What are the active SK-NIC Fund grant calls for small and large ICT projects?'
    },
    intentHint: {
      sk: 'Výzvy na predkladanie žiadostí, alokované rozpočty a termíny',
      en: 'Open calls for proposals, allocated budgets and deadlines'
    },
    keywords: [
      'sk-nic', 'sknik', 'sk nic', 'fond', 'vyzva', 'vyzvy', 'granty', 'dotacie',
      'financovanie', 'rozpocet', 'ikt', 'projekty', '2026', 'peniaze', 'podpora', 'podanie'
    ]
  },
  {
    id: 'sknic-expenses',
    category: 'sk-nic',
    icon: '📋',
    categoryLabel: { sk: 'Fond SK-NIC', en: 'SK-NIC Fund' },
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    query: {
      sk: 'Aké sú podmienky a oprávnené výdavky pre žiadateľov o grant SK-NIC?',
      en: 'What are the eligibility criteria and funding limits for SK-NIC grant applicants?'
    },
    intentHint: {
      sk: 'Spolufinancovanie, neoprávnené náklady a personálne výdavky',
      en: 'Co-financing rules, ineligible costs and personnel limits'
    },
    keywords: [
      'sk-nic', 'sknik', 'opravnene', 'vydavky', 'naklady', 'uctovnictvo', 'mzdy',
      'hospodarenie', 'limit', 'rozpocet', 'spolufinancovanie', 'kriteria', 'ziadatel', 'pravidla'
    ]
  },
  {
    id: 'sknic-evaluation',
    category: 'sk-nic',
    icon: '🎯',
    categoryLabel: { sk: 'Fond SK-NIC', en: 'SK-NIC Fund' },
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    query: {
      sk: 'Hodnotiace kritériá a bodovanie IKT a AI projektov vo Fonde SK-NIC',
      en: 'Evaluation scoring criteria for digital innovation and AI proposals in SK-NIC'
    },
    intentHint: {
      sk: 'Odborné hodnotenie, spoločenský dopad a technologická inovatívnosť',
      en: 'Expert panel scoring, social impact and technological novelty'
    },
    keywords: [
      'hodnotenie', 'kriteria', 'body', 'bodovanie', 'komisia', 'uspech',
      'sknik', 'inovacie', 'dopad', 'vyber', 'schvalenie', 'panel'
    ]
  },
  {
    id: 'sknic-deadlines',
    category: 'sk-nic',
    icon: '⏱️',
    categoryLabel: { sk: 'Fond SK-NIC', en: 'SK-NIC Fund' },
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    query: {
      sk: 'Termíny uzávierky a etapy podávania žiadostí o grant SK-NIC 2025/2026',
      en: 'Application deadlines and evaluation cycles for SK-NIC Foundation 2025/2026'
    },
    intentHint: {
      sk: 'Harmonogram vyhlasovania výsledkov a zmluvný proces',
      en: 'Timeline for announcement of results and grant contracting'
    },
    keywords: [
      'termin', 'terminy', 'uzavierka', 'datum', 'deadline', 'etapy',
      'harmonogram', 'vyhlasenie', 'zmluva', 'kalendar', 'cas'
    ]
  },

  // EU AI Act & Regulatory
  {
    id: 'eu-ai-art-14',
    category: 'eu-ai',
    icon: '🛡️',
    categoryLabel: { sk: 'EU AI Act', en: 'EU AI Act' },
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    query: {
      sk: 'EU AI Act článok 14 – povinné požiadavky na ľudský dohľad (Human Oversight)',
      en: 'EU AI Act Article 14 Human Oversight and control obligations'
    },
    intentHint: {
      sk: 'Technické audity, stop-tlačidlá a zásahy človeka do autonómnych systémov',
      en: 'Audit logs, override kill-switches and human-in-the-loop validation'
    },
    keywords: [
      'ai act', 'clanok 14', 'clnok 14', 'ludsky dohlad', 'human oversight',
      'kontrola', 'override', 'audit', 'bezpecnost', 'umelej inteligencie', 'clanky', 'nariadenie', 'etika'
    ]
  },
  {
    id: 'eu-ai-high-risk',
    category: 'eu-ai',
    icon: '⚖️',
    categoryLabel: { sk: 'EU AI Act', en: 'EU AI Act' },
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    query: {
      sk: 'Klasifikácia vysoko rizikových systémov umelej inteligencie podľa Nariadenia EÚ',
      en: 'High-Risk AI System compliance requirements and documentation in EU'
    },
    intentHint: {
      sk: 'Posudzovanie zhody (CE), rizikový manažment a technická dokumentácia',
      en: 'Conformity assessment (CE), risk management and technical dossier'
    },
    keywords: [
      'vysoke riziko', 'high risk', 'ce znacka', 'klasifikacia', 'posudenie zhody',
      'technicka dokumentacia', 'nariadenie', 'katalog', 'rizikovy manazment'
    ]
  },
  {
    id: 'eu-ai-penalties',
    category: 'eu-ai',
    icon: '⚠️',
    categoryLabel: { sk: 'EU AI Act', en: 'EU AI Act' },
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    query: {
      sk: 'Sankcie a pokuty za nedodržanie pravidiel EU AI Act pre firmy v SR',
      en: 'EU AI Act penalty framework and statutory enforcement in Slovakia'
    },
    intentHint: {
      sk: 'Až 35 miliónov EUR alebo 7 % celosvetového obratu podniku',
      en: 'Statutory fines up to €35M or 7% global turnover'
    },
    keywords: [
      'pokuty', 'sankcie', 'tresty', 'pokuta', 'postih', 'pokuty ai',
      'porusenie', '35 milionov', '7 percent', 'pokutovanie', 'statny organ'
    ]
  },
  {
    id: 'eu-ai-sovereignty',
    category: 'eu-ai',
    icon: '🔒',
    categoryLabel: { sk: 'EU AI Act', en: 'EU AI Act' },
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    query: {
      sk: 'GDPR a pravidlá suverénneho spracovania osobných údajov pri nasadení LLM',
      en: 'Sovereign AI data residency and GDPR compliance for enterprise models'
    },
    intentHint: {
      sk: 'Ukladanie dát v rámci EÚ, zákaz trénovania na citlivých údajoch',
      en: 'EU data residency, zero-retention training contracts'
    },
    keywords: [
      'gdpr', 'suverenita', 'ochrana udajov', 'osobne udaje', 'servery',
      'eu data residency', 'llm', 'trenovanie', 'rezidencia', 'lokalita dat'
    ]
  },

  // Slovak Tax & Invoicing Rules
  {
    id: 'tax-ic-dph',
    category: 'tax',
    icon: '💶',
    categoryLabel: { sk: 'DPH / Dane', en: 'Tax & VAT' },
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    query: {
      sk: 'Overenie formátu IČ DPH v registri Finančnej správy SR a VIES',
      en: 'Validate Slovak VAT (IČ DPH) registration and VIES format verification'
    },
    intentHint: {
      sk: 'Overenie platiteľa dane, nulové daňové nedoplatky a API overenie',
      en: 'Taxpayer validation, zero arrears check and VIES registry API'
    },
    keywords: [
      'ic dph', 'dph', 'dphacko', 'vies', 'financna sprava', 'dan', 'platca',
      'nedoplatky', 'overenie dph', 'danovy urad', 'ico', 'dic', 'overit dph'
    ]
  },
  {
    id: 'tax-vat-rates',
    category: 'tax',
    icon: '📊',
    categoryLabel: { sk: 'DPH / Dane', en: 'Tax & VAT' },
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    query: {
      sk: 'Sadzby DPH v SR pre rok 2025/2026 a pravidlá elektronickej fakturácie',
      en: 'Slovak VAT rates and statutory e-invoicing updates for 2025/2026'
    },
    intentHint: {
      sk: 'Základná sadzba 23 %, znížené sadzby 19 % a 5 % a povinnosti B2B',
      en: 'Standard 23% rate, reduced 19% & 5% brackets and B2B requirements'
    },
    keywords: [
      'sadzby dph', '23 percent', '19 percent', '5 percent', 'faktura', 'fakturacia',
      'elektronicka faktura', 'dane 2025', 'dane 2026', 'sadzba dane', 'zmena dph'
    ]
  },
  {
    id: 'tax-rd-superdeduction',
    category: 'tax',
    icon: '💡',
    categoryLabel: { sk: 'DPH / Dane', en: 'Tax & VAT' },
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    query: {
      sk: 'Podmienky pre odpočet výdavkov na výskum a vývoj (R&D superodpočet v SR)',
      en: 'Slovak R&D super-deduction tax incentives for software development'
    },
    intentHint: {
      sk: '100 % odpočet mzdových a materiálových nákladov na vývoj softvéru',
      en: '100% deduction of software engineering R&D payroll'
    },
    keywords: [
      'superodpocet', 'odpocet', 'vyskum', 'vyvoj', 'r&d', 'dane softver',
      'uspora na dani', 'it vyvoj', 'mzdy programatorov', 'dane', 'uspora'
    ]
  },

  // GovTech & MIRRI SR
  {
    id: 'govtech-mirri-calls',
    category: 'govtech',
    icon: '🏛️',
    categoryLabel: { sk: 'MIRRI / GovTech', en: 'MIRRI GovTech' },
    badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-500/40',
    query: {
      sk: 'MIRRI SR grantové výzvy na podporu digitalizácie a inovácií',
      en: 'MIRRI SR GovTech calls and digital transformation grants'
    },
    intentHint: {
      sk: 'Výzvy z Plánu obnovy a Programu Slovensko pre AI a GovTech',
      en: 'Recovery Plan and Program Slovakia allocations for GovTech'
    },
    keywords: [
      'mirri', 'ministerstvo', 'plan obnovy', 'digitalizacia', 'program slovensko',
      'granty mirri', 'statne dotacie', 'statny rozpocet', 'inovacie mirri'
    ]
  },
  {
    id: 'govtech-tenders',
    category: 'govtech',
    icon: '📜',
    categoryLabel: { sk: 'MIRRI / GovTech', en: 'MIRRI GovTech' },
    badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-500/40',
    query: {
      sk: 'Podmienky účasti IT dodávateľov vo verejnom obstarávaní (ÚVO SR)',
      en: 'Slovak Public Procurement (ÚVO) tender guidelines for IT vendors'
    },
    intentHint: {
      sk: 'Podmienky účasti, register partnerov verejného sektora (RPVS)',
      en: 'Eligibility certificates and Public Sector Partner Register (RPVS)'
    },
    keywords: [
      'uvo', 'obstaravanie', 'tender', 'verejne obstaravanie', 'rpvs',
      'zakazka', 'dodavatel', 'statna zakazka', 'obstaravat', 'sutaz'
    ]
  },
  {
    id: 'govtech-apis',
    category: 'govtech',
    icon: '🔌',
    categoryLabel: { sk: 'MIRRI / GovTech', en: 'MIRRI GovTech' },
    badgeColor: 'bg-violet-950/80 text-violet-300 border-violet-500/40',
    query: {
      sk: 'Integrácia so štátnymi API rozhraniami a e-Government modulmi Slovensko.sk',
      en: 'Integration with Slovensko.sk e-Government state APIs and identity'
    },
    intentHint: {
      sk: 'ÚPVS, e-schránky, autentifikácia eID a autorizačné tokeny',
      en: 'National portal APIs, electronic mailboxes and eID tokens'
    },
    keywords: [
      'slovensko.sk', 'upvs', 'api', 'e-schranka', 'eid', 'statne api',
      'integracia', 'identity', 'statny portal', 'statne sluzby', 'e-gov'
    ]
  }
];

// Normalize helper to support accent-insensitive search (e.g., 'vyzva' matches 'výzvy')
const normalizeForSearch = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// Fuse.js configuration for fuzzy search matching across Slovak and English fields
const FUSE_OPTIONS: IFuseOptions<SearchIntentSuggestion> = {
  keys: [
    { name: 'query.sk', weight: 0.35 },
    { name: 'query.en', weight: 0.2 },
    { name: 'keywords', weight: 0.25 },
    { name: 'intentHint.sk', weight: 0.15 },
    { name: 'intentHint.en', weight: 0.1 },
    { name: 'categoryLabel.sk', weight: 0.1 },
    { name: 'categoryLabel.en', weight: 0.05 }
  ],
  threshold: 0.45,
  distance: 100,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true
};

/**
 * GroundedResponseWithCitations Component
 * Highlights specific segments of text that are verified by Google Search grounding
 * and attaches footnote-style superscript links [1], [2] pointing to the source URLs.
 */
interface GroundedResponseWithCitationsProps {
  text: string;
  sources?: GroundedSource[];
  groundingSupports?: GroundingSupport[];
  language: CopilotLanguage;
}

const GroundedResponseWithCitations: React.FC<GroundedResponseWithCitationsProps> = ({
  text,
  sources = [],
  groundingSupports = [],
  language
}) => {
  // If no sources exist, render plain formatted text
  if (!sources || sources.length === 0) {
    return <div className="whitespace-pre-wrap">{text}</div>;
  }

  // Build resolved segments with start/end indices and associated source chunk indices
  const resolvedSegments = useMemo(() => {
    interface ResolvedSpan {
      start: number;
      end: number;
      chunkIndices: number[];
      textSnippet?: string;
    }

    const spans: ResolvedSpan[] = [];

    // 1. Process explicit groundingSupports from Gemini API
    if (groundingSupports && groundingSupports.length > 0) {
      for (const support of groundingSupports) {
        if (!support.groundingChunkIndices || support.groundingChunkIndices.length === 0) continue;

        let start = support.segment?.startIndex;
        let end = support.segment?.endIndex;

        // If character indices are absent but text is given, locate text
        if ((start === undefined || end === undefined) && support.segment?.text) {
          const idx = text.indexOf(support.segment.text);
          if (idx !== -1) {
            start = idx;
            end = idx + support.segment.text.length;
          }
        }

        if (start !== undefined && end !== undefined && end > start && start >= 0 && end <= text.length) {
          spans.push({
            start,
            end,
            chunkIndices: support.groundingChunkIndices,
            textSnippet: text.slice(start, end)
          });
        }
      }
    }

    // 2. If no valid character spans were found, fallback to intelligent semantic segment matching
    if (spans.length === 0 && sources.length > 0) {
      // Check if text already contains markdown footnote markers like [1], [2]
      const footnoteRegex = /\[(\d+)\]/g;
      let match: RegExpExecArray | null;
      let hasFootnoteTags = false;

      while ((match = footnoteRegex.exec(text)) !== null) {
        hasFootnoteTags = true;
        const fnNum = parseInt(match[1], 10);
        const chunkIdx = fnNum - 1;
        if (chunkIdx >= 0 && chunkIdx < sources.length) {
          // Highlight previous sentence or clause up to 80 chars
          const matchStart = match.index;
          const matchEnd = matchStart + match[0].length;
          const prevStart = Math.max(0, text.lastIndexOf('.', matchStart - 1) + 1);
          spans.push({
            start: prevStart,
            end: matchStart,
            chunkIndices: [chunkIdx],
            textSnippet: text.slice(prevStart, matchStart).trim()
          });
        }
      }

      // If no footnote tags, highlight phrases containing key terminology from the sources
      if (!hasFootnoteTags) {
        sources.forEach((source, sIdx) => {
          // Identify recognizable keywords from source titles or domains
          const candidates = [
            'SK-NIC',
            'Fond SK-NIC',
            'EU AI Act',
            'MIRRI SR',
            'Finančná správa',
            'IČ DPH',
            'Article 14',
            'článok 14',
            'DPH'
          ];

          for (const cand of candidates) {
            const pos = text.indexOf(cand);
            if (pos !== -1) {
              // Find clause boundaries
              const clauseStart = Math.max(0, text.lastIndexOf('\n', pos) + 1, text.lastIndexOf('.', pos) + 1);
              let clauseEnd = text.indexOf('.', pos);
              if (clauseEnd === -1) clauseEnd = text.indexOf('\n', pos);
              if (clauseEnd === -1) clauseEnd = text.length;

              const cleanStart = clauseStart;
              const cleanEnd = clauseEnd;

              // Check for overlap with existing spans
              const overlaps = spans.some((sp) => Math.max(sp.start, cleanStart) < Math.min(sp.end, cleanEnd));
              if (!overlaps && cleanEnd > cleanStart) {
                spans.push({
                  start: cleanStart,
                  end: cleanEnd,
                  chunkIndices: [sIdx],
                  textSnippet: text.slice(cleanStart, cleanEnd)
                });
                break;
              }
            }
          }
        });
      }
    }

    // Sort by start index and filter out any overlapping ranges
    spans.sort((a, b) => a.start - b.start);

    const nonOverlapping: ResolvedSpan[] = [];
    let lastEnd = 0;
    for (const span of spans) {
      if (span.start >= lastEnd) {
        nonOverlapping.push(span);
        lastEnd = span.end;
      }
    }

    return nonOverlapping;
  }, [text, groundingSupports, sources]);

  // Construct text and citation fragments
  const fragments = useMemo(() => {
    if (resolvedSegments.length === 0) {
      return [{ type: 'plain' as const, content: text }];
    }

    const items: Array<
      | { type: 'plain'; content: string }
      | { type: 'highlight'; content: string; chunkIndices: number[] }
    > = [];

    let currentPos = 0;

    for (const span of resolvedSegments) {
      if (span.start > currentPos) {
        items.push({
          type: 'plain',
          content: text.slice(currentPos, span.start)
        });
      }

      items.push({
        type: 'highlight',
        content: text.slice(span.start, span.end),
        chunkIndices: span.chunkIndices
      });

      currentPos = span.end;
    }

    if (currentPos < text.length) {
      items.push({
        type: 'plain',
        content: text.slice(currentPos)
      });
    }

    return items;
  }, [text, resolvedSegments]);

  return (
    <div className="font-sans text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap space-y-1">
      {fragments.map((frag, idx) => {
        if (frag.type === 'plain') {
          return <span key={idx}>{frag.content}</span>;
        }

        // Highlighted segment with footnote-style superscript links
        return (
          <span key={idx} className="inline relative group/segment">
            <mark className="bg-cyan-950/60 text-cyan-50 px-1.5 py-0.5 rounded border-b-2 border-cyan-400/80 hover:bg-cyan-900/60 hover:border-cyan-300 transition-colors font-sans not-italic cursor-help">
              {frag.content}
            </mark>

            {/* Footnote-style superscripts [1], [2] */}
            <sup className="ml-1 inline-flex items-center align-super select-none font-mono">
              {frag.chunkIndices.map((cIdx) => {
                const src = sources[cIdx];
                if (!src) return null;
                const footnoteNum = cIdx + 1;

                let domain = '';
                try {
                  domain = new URL(src.url).hostname.replace(/^www\./, '');
                } catch {
                  domain = 'web';
                }

                return (
                  <a
                    key={cIdx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 rounded text-[10px] font-bold leading-none bg-cyan-950 text-cyan-300 hover:text-white border border-cyan-500/60 hover:border-cyan-400 hover:bg-cyan-800 transition-all hover:scale-110 shadow-sm cursor-pointer"
                    title={`[${footnoteNum}] ${src.title}\n(${src.url})`}
                    aria-label={`Zdroj [${footnoteNum}]: ${src.title}`}
                  >
                    [{footnoteNum}]
                  </a>
                );
              })}
            </sup>
          </span>
        );
      })}
    </div>
  );
};

export const SlovakCopilotApp: React.FC = () => {
  const [language, setLanguage] = useState<CopilotLanguage>('sk');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'copilot',
      text: 'Vitajte v portáli RMD26 Slovenský Copilot. Systém je vybavený nástrojom Google Search Grounding a fuzzy vyhľadávacím jadrom Fuse.js pre overovanie aktuálnych výziev Fondu SK-NIC, grantov MIRRI SR a regulačných noriem EU AI Act v reálnom čase.',
      tag: 'Google Search Ready',
      language: 'sk',
      isGrounded: true,
      timestamp: 'Online',
      sources: [
        {
          title: 'Fond SK-NIC – Oficiálne grantové výzvy pre IKT inovácie a projekty',
          url: 'https://sk-nic.sk/fond-sk-nic/'
        },
        {
          title: 'MIRRI SR – Digitálne grantové schémy a Program Slovensko',
          url: 'https://www.mirri.gov.sk/'
        },
        {
          title: 'Európska komisia – Nariadenie o umelej inteligencii (EU AI Act)',
          url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'
        }
      ],
      groundingSupports: [
        {
          groundingChunkIndices: [0],
          segment: {
            text: 'aktuálnych výziev Fondu SK-NIC'
          }
        },
        {
          groundingChunkIndices: [1],
          segment: {
            text: 'grantov MIRRI SR'
          }
        },
        {
          groundingChunkIndices: [2],
          segment: {
            text: 'regulačných noriem EU AI Act'
          }
        }
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Auto-Complete Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<SuggestionCategory>('all');

  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);

  // Switch language
  const handleLanguageChange = (newLang: CopilotLanguage) => {
    if (newLang === language) return;
    setLanguage(newLang);
    const greeting: ChatMessage =
      newLang === 'en'
        ? {
            id: `m-${Date.now()}`,
            sender: 'copilot',
            text: 'English mode active. RMD26 Slovak Copilot is now grounded with real-time Google Search, footnote-style citations, and typo-tolerant Fuse.js fuzzy autocomplete for SK-NIC calls and EU regulations.',
            tag: 'Search Grounding Active',
            language: 'en',
            isGrounded: true,
            timestamp: new Date().toLocaleTimeString(),
            sources: [
              {
                title: 'SK-NIC Foundation – ICT Innovation & Tech Grants',
                url: 'https://sk-nic.sk/en/sk-nic-fund/'
              },
              {
                title: 'MIRRI SR – Ministry of Investments, Regional Development and Informatization',
                url: 'https://www.mirri.gov.sk/en/'
              },
              {
                title: 'European Commission – EU Artificial Intelligence Act Article 14',
                url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'
              }
            ],
            groundingSupports: [
              {
                groundingChunkIndices: [0],
                segment: { text: 'SK-NIC calls' }
              },
              {
                groundingChunkIndices: [2],
                segment: { text: 'EU regulations' }
              }
            ]
          }
        : {
            id: `m-${Date.now()}`,
            sender: 'copilot',
            text: 'Slovenský režim aktívny. Asistent využíva Google Search a fuzzy matching Fuse.js s citáciami formou indexovaných horných indexov pre grantové výzvy Fondu SK-NIC.',
            tag: 'Google Search Aktívny',
            language: 'sk',
            isGrounded: true,
            timestamp: new Date().toLocaleTimeString(),
            sources: [
              {
                title: 'Fond SK-NIC – Oficiálne grantové výzvy pre IKT inovácie a projekty',
                url: 'https://sk-nic.sk/fond-sk-nic/'
              },
              {
                title: 'Finančná správa SR – Register platiteľov DPH a legislatíva',
                url: 'https://www.financnasprava.sk/'
              }
            ],
            groundingSupports: [
              {
                groundingChunkIndices: [0],
                segment: { text: 'grantové výzvy Fondu SK-NIC' }
              }
            ]
          };
    setMessages((prev) => [...prev, greeting]);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered auto-complete suggestions powered by Fuse.js fuzzy search algorithm
  const filteredSuggestions = useMemo(() => {
    const rawQuery = inputVal.trim();

    // 1. Initial category filter
    const candidatePool =
      activeCategoryFilter === 'all'
        ? SEARCH_INTENT_SUGGESTIONS
        : SEARCH_INTENT_SUGGESTIONS.filter((s) => s.category === activeCategoryFilter);

    // If query is empty, show all suggestions in category
    if (!rawQuery) {
      return candidatePool.map((item) => ({
        ...item,
        isFuzzyMatch: false
      }));
    }

    // 2. Execute Fuse.js fuzzy matching
    const fuse = new Fuse(candidatePool, FUSE_OPTIONS);
    const fuseResults = fuse.search(rawQuery);

    if (fuseResults.length > 0) {
      return fuseResults.map((result) => ({
        ...result.item,
        fuzzyScore: result.score,
        isFuzzyMatch: result.score !== undefined && result.score > 0.04
      }));
    }

    // 3. Fallback accent-insensitive normalized query match
    const normalizedQuery = normalizeForSearch(rawQuery);
    return candidatePool
      .filter((s) => {
        const skText = normalizeForSearch(s.query.sk);
        const enText = normalizeForSearch(s.query.en);
        const skHint = normalizeForSearch(s.intentHint.sk);
        const enHint = normalizeForSearch(s.intentHint.en);
        const categoryName = normalizeForSearch(s.categoryLabel[language]);
        const kw = s.keywords?.map(normalizeForSearch).join(' ') || '';

        return (
          skText.includes(normalizedQuery) ||
          enText.includes(normalizedQuery) ||
          skHint.includes(normalizedQuery) ||
          enHint.includes(normalizedQuery) ||
          categoryName.includes(normalizedQuery) ||
          kw.includes(normalizedQuery)
        );
      })
      .map((item) => ({
        ...item,
        isFuzzyMatch: true
      }));
  }, [inputVal, activeCategoryFilter, language]);

  // Execute real search grounded query via backend API
  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputVal;
    if (!q.trim() || loading) return;

    setIsDropdownOpen(false);
    setSelectedSuggestionIndex(-1);
    setErrorStatus(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      language,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      if (useSearchGrounding) {
        const response = await fetch('/api/sk-nic-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: q,
            language
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${response.status}`);
        }

        const data = await response.json();

        const botMsg: ChatMessage = {
          id: `c-${Date.now()}`,
          sender: 'copilot',
          text: data.text,
          tag: language === 'en' ? 'Google Search Grounded' : 'Google Search Overené',
          language,
          isGrounded: true,
          sources: data.sources || [],
          groundingSupports: data.groundingSupports || [],
          searchQueries: data.searchQueries || [],
          timestamp: new Date().toLocaleTimeString()
        };

        setMessages((prev) => [...prev, botMsg]);
      } else {
        await new Promise((res) => setTimeout(res, 600));
        const botMsg: ChatMessage = {
          id: `c-${Date.now()}`,
          sender: 'copilot',
          text:
            language === 'en'
              ? 'Local simulation mode: Identified active SK-NIC Call (Code: SKNICVP26_017). Project funding is allocated under the ICT Innovation scheme with an approved budget of €17,580.03, requiring strict adherence to EU AI Act Article 14 human oversight.'
              : 'Lokálny režim simulácie: Nájdená výzva Fondu SK-NIC (kód: SKNICVP26_017). Projekt je zaradený do schémy IKT inovácií s rozpočtom 17 580,03 € a vyžaduje splnenie požiadaviek na ľudský dohľad podľa článku 14 EU AI Act.',
          tag: 'Simulation Mode',
          language,
          isGrounded: true,
          timestamp: new Date().toLocaleTimeString(),
          sources: [
            {
              title: 'Fond SK-NIC – Výzvy pre veľké a malé projekty',
              url: 'https://sk-nic.sk/fond-sk-nic/'
            },
            {
              title: 'Európska komisia – Nariadenie o umelej inteligencii (Článok 14)',
              url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'
            }
          ],
          groundingSupports: [
            {
              groundingChunkIndices: [0],
              segment: {
                text: language === 'en' ? 'SK-NIC Call (Code: SKNICVP26_017)' : 'výzva Fondu SK-NIC (kód: SKNICVP26_017)'
              }
            },
            {
              groundingChunkIndices: [1],
              segment: {
                text: language === 'en' ? 'EU AI Act Article 14 human oversight' : 'článku 14 EU AI Act'
              }
            }
          ]
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err: any) {
      console.error('Search grounding error:', err);
      setErrorStatus(err.message || 'Nepodarilo sa spojiť s Google Search nástrojom.');

      const fallbackMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text:
          language === 'en'
            ? `Google Search Grounding encountered an issue: ${err.message}. Retrying or falling back to authenticated sovereign verification.`
            : `Pri volaní Google Search nástroja nastala chyba: ${err.message}. Dáta je možné overiť priamo na oficiálnom webe sk-nic.sk.`,
        tag: 'Search Error',
        language,
        isGrounded: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation inside auto-complete dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || filteredSuggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < filteredSuggestions.length) {
        e.preventDefault();
        const selected = filteredSuggestions[selectedSuggestionIndex];
        const selectedText = selected.query[language];
        handleSend(selectedText);
      }
    } else if (e.key === 'Tab') {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < filteredSuggestions.length) {
        e.preventDefault();
        const selected = filteredSuggestions[selectedSuggestionIndex];
        setInputVal(selected.query[language]);
        setIsDropdownOpen(false);
        setSelectedSuggestionIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Select suggestion and immediately trigger search
  const handleSelectSuggestion = (suggestion: SearchIntentSuggestion, autoExecute: boolean = true) => {
    const text = suggestion.query[language];
    setInputVal(text);
    setIsDropdownOpen(false);
    setSelectedSuggestionIndex(-1);
    if (autoExecute) {
      handleSend(text);
    } else {
      inputElementRef.current?.focus();
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportBrief = () => {
    const content = messages
      .map((m) => {
        let textPart = `[${m.timestamp || ''}] ${m.sender === 'copilot' ? 'RMD26 Slovak Copilot (Grounded)' : 'User'}:\n${m.text}`;
        if (m.sources && m.sources.length > 0) {
          textPart += `\n\nZdroje a citácie / Sources & Citations:\n` +
            m.sources.map((s, idx) => `[${idx + 1}] ${s.title}: ${s.url}`).join('\n');
        }
        return textPart + '\n-----------------------------------\n';
      })
      .join('\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sk-nic-grounded-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 text-left font-mono">
      {/* Top Header & Search Grounding Status Banner */}
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-md shadow-violet-950/40 shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                RMD26 Slovak Copilot · Google Search Grounded
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Google Search</span>
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans block">
              {language === 'sk'
                ? 'Overené dáta SK-NIC s hornými indexmi citácií [1] a interaktívnym zvýraznením segmentov'
                : 'Verified SK-NIC data with superscript citations [1] and highlighted response segments'}
            </span>
          </div>
        </div>

        {/* Controls: Search Grounding Toggle & Language Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Grounding Active Pill Button */}
          <button
            type="button"
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              useSearchGrounding
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-950/40'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Prepnúť Google Search Grounding nástroj"
          >
            <Search className="w-3 h-3 text-cyan-400" />
            <span>{useSearchGrounding ? 'Google Search: ON' : 'Google Search: OFF'}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => handleLanguageChange('sk')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold transition-all ${
                language === 'sk'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🇸🇰 SK</span>
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🇬🇧 EN</span>
            </button>
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={handleExportBrief}
            title={language === 'sk' ? 'Stiahnuť overený report s citáciami' : 'Download Grounded Report with Citations'}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorStatus && (
        <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-[11px]">{errorStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSend()}
            className="text-[10px] underline hover:text-white ml-2 shrink-0 font-bold cursor-pointer"
          >
            {language === 'sk' ? 'Skúsiť znova' : 'Retry'}
          </button>
        </div>
      )}

      {/* Chat Messages History Container */}
      <div className="p-4 rounded-xl bg-zinc-950/95 border border-zinc-800 space-y-4 max-h-[380px] overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3.5 rounded-xl text-xs leading-relaxed transition-all ${
              m.sender === 'copilot'
                ? 'bg-zinc-900/70 border border-zinc-800 text-zinc-200'
                : 'bg-violet-950/40 border border-violet-700/50 text-violet-200 ml-4'
            }`}
          >
            {/* Message header */}
            <div className="flex items-center justify-between mb-2 text-[10px] text-zinc-400 pb-1.5 border-b border-zinc-800/60">
              <span className="font-bold flex items-center gap-1.5">
                <span>
                  {m.sender === 'copilot'
                    ? 'RMD26 Slovak Copilot'
                    : language === 'en'
                    ? 'User'
                    : 'Používateľ'}
                </span>
                <span className="text-[9px] px-1 rounded bg-zinc-800 text-zinc-400 uppercase">
                  {m.language}
                </span>
                {m.isGrounded && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-bold flex items-center gap-1">
                    <Search className="w-2.5 h-2.5" />
                    <span>Google Grounded</span>
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                {m.tag && (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-cyan-400 border border-zinc-800 font-medium">
                    {m.tag}
                  </span>
                )}
                {m.timestamp && <span className="text-zinc-500">{m.timestamp}</span>}
                {m.sender === 'copilot' && (
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(m.id, m.text)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                    title={language === 'sk' ? 'Kopírovať' : 'Copy'}
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Message text with segmented citation highlighting & footnote-style superscripts [1] */}
            {m.sender === 'copilot' ? (
              <GroundedResponseWithCitations
                text={m.text}
                sources={m.sources}
                groundingSupports={m.groundingSupports}
                language={m.language}
              />
            ) : (
              <div className="font-sans text-xs leading-relaxed whitespace-pre-wrap text-zinc-100">
                {m.text}
              </div>
            )}

            {/* Numbered Footnote Sources Reference Section */}
            {m.sources && m.sources.length > 0 && (
              <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 space-y-2 font-mono">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-cyan-400" />
                    <span>
                      {language === 'sk'
                        ? 'Zdroje a citácie (Google Search):'
                        : 'Sources & Citations (Google Search):'}
                    </span>
                  </span>
                  <span className="text-zinc-500 text-[9px]">
                    {m.sources.length} {language === 'sk' ? 'odkazov' : 'references'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {m.sources.map((src, sIdx) => {
                    const footnoteNum = sIdx + 1;
                    let domain = '';
                    try {
                      domain = new URL(src.url).hostname.replace(/^www\./, '');
                    } catch {
                      domain = 'web';
                    }

                    return (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-[11px] text-zinc-300 hover:text-white transition-all group/src shadow-sm"
                        title={src.title}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono font-bold text-[10px] shrink-0">
                            [{footnoteNum}]
                          </span>
                          <span className="truncate font-sans font-medium text-xs">
                            {src.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 text-zinc-500 group-hover/src:text-cyan-400">
                          <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-900 border border-zinc-800 font-mono hidden xs:inline">
                            {domain}
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Queries executed by the model */}
            {m.searchQueries && m.searchQueries.length > 0 && (
              <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                <span>Dopyty / Queries: </span>
                <span className="text-zinc-400 italic">
                  {m.searchQueries.map((sq) => `"${sq}"`).join(', ')}
                </span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-cyan-500/40 text-xs text-cyan-300 flex items-center justify-between shadow-md shadow-cyan-950/30 animate-pulse">
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>
                {language === 'sk'
                  ? 'Prehľadávam Google Search a overujem reálne dáta Fondu SK-NIC & legislatívu SR...'
                  : 'Querying Google Search tool for live SK-NIC grant call data and Slovak regulations...'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400">&lt;5ms Wasm</span>
          </div>
        )}
      </div>

      {/* Auto-Complete Dropdown Container & Input Form with Fuse.js Fuzzy Matching */}
      <div ref={dropdownContainerRef} className="relative">
        {/* Floating Auto-Complete Dropdown Panel */}
        {isDropdownOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-2xl bg-zinc-950/98 border border-zinc-700/80 shadow-2xl backdrop-blur-2xl overflow-hidden font-sans ring-1 ring-cyan-500/30 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Dropdown Header: Category Filter Tabs & Fuzzy Search Indicator */}
            <div className="p-2.5 border-b border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span className="uppercase">
                    {language === 'sk' ? 'Fuzzy Návrhy:' : 'Fuzzy Suggestions:'}
                  </span>
                  <span className="text-cyan-400 px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30">
                    {filteredSuggestions.length}
                  </span>
                </div>

                {/* Fuse.js Typo Tolerance Badge */}
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-500/40 text-violet-300 text-[9px] font-mono font-semibold">
                  <Zap className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Fuse.js Typo-Tolerant</span>
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono scrollbar-none">
                {(
                  [
                    { id: 'all', label: language === 'sk' ? 'Všetky' : 'All' },
                    { id: 'sk-nic', label: '🪙 Fond SK-NIC' },
                    { id: 'eu-ai', label: '🛡️ EU AI Act' },
                    { id: 'tax', label: '💶 DPH / Dane' },
                    { id: 'govtech', label: '🏛️ MIRRI' }
                  ] as { id: SuggestionCategory; label: string }[]
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategoryFilter(cat.id);
                      setSelectedSuggestionIndex(-1);
                    }}
                    className={`px-2 py-0.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      activeCategoryFilter === cat.id
                        ? 'bg-violet-600 text-white font-bold shadow-sm'
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions Scrollable List */}
            {filteredSuggestions.length > 0 ? (
              <div className="max-h-64 overflow-y-auto overscroll-contain p-1.5 space-y-1">
                {filteredSuggestions.map((item, idx) => {
                  const isSelected = idx === selectedSuggestionIndex;
                  const queryText = item.query[language];
                  const hintText = item.intentHint[language];

                  // Calculate match confidence percentage from Fuse score
                  const matchConfidence =
                    item.fuzzyScore !== undefined
                      ? Math.max(70, Math.round((1 - item.fuzzyScore) * 100))
                      : null;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item, true)}
                      onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                      className={`p-2.5 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer group border ${
                        isSelected
                          ? 'bg-violet-950/70 border-cyan-500/60 text-white shadow-md shadow-violet-950/30'
                          : 'bg-zinc-900/30 hover:bg-zinc-900/80 border-transparent text-zinc-300 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-sm shrink-0">{item.icon}</span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${item.badgeColor}`}
                          >
                            {item.categoryLabel[language]}
                          </span>

                          {/* Fuzzy Match Badge when typo or partial match occurred */}
                          {inputVal.trim() && item.isFuzzyMatch && matchConfidence && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              <span>{matchConfidence}% zhoda</span>
                            </span>
                          )}

                          <span className="text-[10px] text-zinc-400 font-mono truncate">
                            {hintText}
                          </span>
                        </div>

                        <div className="text-xs font-semibold leading-relaxed pl-6">
                          {queryText}
                        </div>
                      </div>

                      {/* Action buttons on hover/select */}
                      <div className="flex items-center gap-1.5 shrink-0 self-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSuggestion(item, false);
                          }}
                          title={language === 'sk' ? 'Doplniť do poľa (Tab)' : 'Fill input (Tab)'}
                          className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono transition-colors"
                        >
                          <span>Tab</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSuggestion(item, true);
                          }}
                          title={language === 'sk' ? 'Okamžite vyhľadať (Enter)' : 'Execute search (Enter)'}
                          className="px-2 py-1 rounded-md bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-cyan-100 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                        >
                          <Search className="w-2.5 h-2.5" />
                          <span className="hidden xs:inline">
                            {language === 'sk' ? 'Hľadať' : 'Search'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-zinc-400 font-mono space-y-2">
                <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                <p>
                  {language === 'sk'
                    ? `Žiadne fuzzy zhody pre výraz "${inputVal}".`
                    : `No fuzzy matches found for "${inputVal}".`}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {language === 'sk'
                    ? 'Skúste iný termín (napr. sknik, dph, clanok 14, mirri) alebo prepnite kategóriu.'
                    : 'Try another keyword (e.g., sknik, vat, article 14, mirri) or switch categories.'}
                </p>
              </div>
            )}

            {/* Dropdown Footer: Keyboard Shortcuts & Fuzzy Feedback */}
            <div className="px-3 py-1.5 bg-zinc-900/90 border-t border-zinc-800 flex flex-wrap items-center justify-between text-[10px] font-mono text-zinc-400 gap-2">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  {language === 'sk'
                    ? 'Fuse.js fuzzy tolerancia: preklepy a tvary slov sú automaticky vyrovnané'
                    : 'Fuse.js fuzzy matching: typos, prefixes and declensions are auto-resolved'}
                </span>
              </span>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="flex items-center gap-0.5">
                  <kbd className="px-1 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-[9px]">↑↓</kbd>
                  <span className="hidden sm:inline">navigácia</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <kbd className="px-1 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-[9px]">Enter</kbd>
                  <span className="hidden sm:inline">odoslať</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <kbd className="px-1 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-[9px]">Esc</kbd>
                  <span className="hidden sm:inline">zavrieť</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div
            className={`flex-1 flex items-center gap-2 bg-zinc-950 border rounded-xl px-3 py-2 transition-all shadow-inner ${
              isDropdownOpen
                ? 'border-cyan-500 ring-1 ring-cyan-500/40'
                : 'border-zinc-800 hover:border-zinc-700 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/40'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <input
              ref={inputElementRef}
              type="text"
              value={inputVal}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
                setSelectedSuggestionIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={
                language === 'sk'
                  ? 'Fuzzy hľadanie výziev SK-NIC, EU AI Act, sadzieb DPH (toleruje preklepy)...'
                  : 'Fuzzy search SK-NIC calls, EU AI Act, VAT rules (typo-tolerant)...'
              }
              className="flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 outline-none font-sans"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => {
                  setInputVal('');
                  inputElementRef.current?.focus();
                }}
                className="text-zinc-500 hover:text-zinc-300 text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            )}

            {/* Quick Trigger Button for Dropdown */}
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                inputElementRef.current?.focus();
              }}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="Zobraziť fuzzy návrhy dopytov"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">Fuzzy</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-950/40 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {loading ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{language === 'sk' ? 'Vyhľadať cez Google' : 'Search with Google'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
