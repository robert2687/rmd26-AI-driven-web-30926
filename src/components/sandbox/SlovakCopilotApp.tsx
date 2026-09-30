import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle2, FileText, Globe, Download, Copy, Check, Shield } from 'lucide-react';

export type CopilotLanguage = 'sk' | 'en';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  tag?: string;
  language: CopilotLanguage;
}

export const SlovakCopilotApp: React.FC = () => {
  const [language, setLanguage] = useState<CopilotLanguage>('sk');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'copilot',
      text: 'Vitajte v portáli RMD26 Slovenský Copilot. Som autonómny asistent optimalizovaný pre slovenský jazyk, verejnú správu a technologické projekty SK-NIC.',
      tag: 'Systém pripravený',
      language: 'sk'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Switch language and append localized greeting if switching to English for the first time
  const handleLanguageChange = (newLang: CopilotLanguage) => {
    if (newLang === language) return;
    setLanguage(newLang);
    const greeting: ChatMessage = newLang === 'en'
      ? {
          id: `m-${Date.now()}`,
          sender: 'copilot',
          text: 'English language mode active. Welcome to the RMD26 Slovak Copilot Portal. I am optimized for Slovak public administration, SK-NIC innovation funds, and EU regulatory alignment.',
          tag: 'English Mode Ready',
          language: 'en'
        }
      : {
          id: `m-${Date.now()}`,
          sender: 'copilot',
          text: 'Slovenský jazykový režim aktívny. Asistent je pripravený na dopyty pre verejnú správu SR a grantovú schému SK-NIC.',
          tag: 'Slovenčina aktívna',
          language: 'sk'
        };
    setMessages((prev) => [...prev, greeting]);
  };

  const samplePrompts = language === 'sk' ? [
    'Vyhľadať výzvy SK-NIC pre rok 2026',
    'Navrhnúť architektúru multi-agentného systému',
    'Overiť daňové náležitosti a IČ DPH',
    'Generovať návrh projektu pre SK-NIC'
  ] : [
    'Discover SK-NIC 2026 Grant Calls',
    'Synthesize Multi-Agent Architecture Plan',
    'Validate Slovak Tax & IČ DPH Format',
    'Generate SK-NIC Grant Proposal Draft'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputVal;
    if (!q.trim()) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: q, language };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    setTimeout(() => {
      const isEnglish = language === 'en';
      let reply = isEnglish
        ? 'Request processed successfully. All parameters verified against Slovak Republic and EU digital standards.'
        : 'Požiadavka bola spracovaná. Všetky dáta boli overené podľa legislatívy SR a EÚ.';
      let tag = isEnglish ? 'Analysis Complete' : 'Analýza dokončená';

      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('sk-nic') || lowerQ.includes('grant') || lowerQ.includes('výzv')) {
        reply = isEnglish
          ? 'Identified active SK-NIC call (Code: SKNICVP26_017). Project "Slovak Copilot" is allocated under the ICT Innovation & AI category with an approved budget of €17,580.03 and implementation period from Aug 1, 2026 to Dec 31, 2026.'
          : 'Nájdená výzva SK-NIC (kód: SKNICVP26_017). Projekt "Slovenský Copilot" je zaradený do kategórie IKT inovácií s rozpočtom 17 580,03 € a implementáciou od 1.8.2026 do 31.12.2026.';
        tag = isEnglish ? 'SK-NIC Fund' : 'Fond SK-NIC';
      } else if (lowerQ.includes('architektúr') || lowerQ.includes('architecture') || lowerQ.includes('multi-agent')) {
        reply = isEnglish
          ? 'Recommended Hexagonal Agentic Architecture: LangGraph Directed Acyclic Graph (DAG) state orchestration combined with client-side WebContainers (Wasm micro-kernel) for sub-5ms feedback. Core specialists: Planner, Nexus Architect, Spark Coder, Sentinel Reviewer, and The Medic Patcher.'
          : 'Odporúčaná hexagonálna architektúra s orchestráciou cez LangGraph a runtime WebContainers pre sub-5ms latenciu. Kľúčoví agenti: Planner, Visual Designer, Architect, Coder a Patcher.';
        tag = isEnglish ? 'Architecture Spec' : 'Technická špecifikácia';
      } else if (lowerQ.includes('dph') || lowerQ.includes('tax') || lowerQ.includes('ič dph')) {
        reply = isEnglish
          ? 'Slovak Tax Identification (IČ DPH) verified: Format requires "SK" prefix followed by exactly 10 digits. Validated against the Finančná správa SR registry API with zero recorded tax arrears and strict VIES compatibility.'
          : 'Formát IČ DPH pre Slovensko overený (SK + 10 číslic). Overenie voči registru Finančnej správy SR prebehlo úspešne bez nezrovnalostí a s plnou kompatibilitou VIES.';
        tag = isEnglish ? 'Tax Registry Pass' : 'Overenie registrov';
      } else if (lowerQ.includes('návrh') || lowerQ.includes('proposal') || lowerQ.includes('generovať')) {
        reply = isEnglish
          ? 'Generated SK-NIC Grant Proposal Executive Abstract: "Slovak Copilot represents an air-gapped sovereign AI development platform ensuring 100% data sovereignty within EU borders, Article 14 human oversight compliance, and sub-5ms developer iteration speed."'
          : 'Vygenerovaný abstrakt žiadosti o grant SK-NIC: "Slovenský Copilot predstavuje air-gapped autonómnu AI platformu garantujúcu 100% dátovú suverenitu na území EÚ, súlad s článkom 14 Nariadenia o AI a sub-5ms vývojársku odozvu."';
        tag = isEnglish ? 'Executive Abstract' : 'Výkonný abstrakt';
      }

      const botMsg: ChatMessage = { id: `c-${Date.now()}`, sender: 'copilot', text: reply, tag, language };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 550);
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-4 text-left font-mono">
      {/* Top Language Switcher Bar */}
      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-300">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white">RMD26 Slovak Copilot Portal</span>
            <span className="text-[10px] text-zinc-400 block sm:inline sm:ml-2">
              {language === 'sk' ? 'Dvojjazyčný asistent pre verejnú správu & SK-NIC' : 'Bilingual GovTech & SK-NIC Grant Engine'}
            </span>
          </div>
        </div>

        {/* Language Choice Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1 self-start sm:self-auto">
          <span className="text-[10px] text-zinc-500 px-1 font-semibold uppercase">Lang:</span>
          <button
            onClick={() => handleLanguageChange('sk')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
              language === 'sk'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🇸🇰</span>
            <span>Slovenčina (SK)</span>
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🇬🇧</span>
            <span>English (EN)</span>
          </button>
        </div>
      </div>

      {/* Sample Quick Queries */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-zinc-400 mr-1">
          {language === 'sk' ? 'Rýchle dopyty:' : 'Quick queries:'}
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white hover:border-violet-500 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages History */}
      <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3 max-h-[240px] overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-xs leading-relaxed transition-all ${
              m.sender === 'copilot'
                ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-200'
                : 'bg-violet-950/40 border border-violet-700/40 text-violet-200 ml-4'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 text-[10px] text-zinc-400">
              <span className="font-bold flex items-center gap-1.5">
                <span>{m.sender === 'copilot' ? 'RMD26 Slovak Copilot' : (m.language === 'en' ? 'User' : 'Používateľ')}</span>
                <span className="text-[9px] px-1 rounded bg-zinc-800 text-zinc-400 uppercase">{m.language}</span>
              </span>

              <div className="flex items-center gap-2">
                {m.tag && (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-cyan-400 border border-zinc-800 font-medium">
                    {m.tag}
                  </span>
                )}
                {m.sender === 'copilot' && (
                  <button
                    onClick={() => handleCopyMessage(m.id, m.text)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    title={language === 'sk' ? 'Kopírovať' : 'Copy'}
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
            <p className="font-sans text-xs leading-relaxed">{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="p-2.5 text-xs text-zinc-400 italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>
              {language === 'sk'
                ? 'Generujem overenú odpoveď podľa legislatívy SR a EÚ...'
                : 'Synthesizing verified legal and architectural response (SK/EU regulations)...'}
            </span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            language === 'sk'
              ? 'Zadajte otázku alebo požiadavku v slovenčine (napr. výzvy SK-NIC, IČ DPH)...'
              : 'Enter query in English (e.g. SK-NIC grant call, VAT validation, architecture RFC)...'
          }
          className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Send className="w-3 h-3" />
          <span>{language === 'sk' ? 'Odoslať' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};
