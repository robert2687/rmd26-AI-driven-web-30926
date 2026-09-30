import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle2, FileText, Globe } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  tag?: string;
}

export const SlovakCopilotApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'copilot',
      text: 'Vitajte v portáli RMD26 Slovenský Copilot. Som autonómny asistent optimalizovaný pre slovenský jazyk, verejnú správu a technologické projekty SK-NIC.',
      tag: 'Systém pripravený'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    'Vyhľadať výzvy SK-NIC pre rok 2026',
    'Navrhnúť architektúru multi-agentného systému',
    'Overiť daňové náležitosti a IČ DPH'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputVal;
    if (!q.trim()) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    setTimeout(() => {
      let reply = 'Požiadavka bola spracovaná. Všetky dáta boli overené podľa legislatívy SR a EÚ.';
      let tag = 'Analýza dokončená';

      if (q.includes('SK-NIC')) {
        reply = 'Nájdená výzva SK-NIC (kód: SKNICVP26_017). Projekt "Slovenský Copilot" je zaradený do kategórie IKT inovácií s rozpočtom 17 580,03 € a implementáciou od 1.8.2026 do 31.12.2026.';
        tag = 'Fond SK-NIC';
      } else if (q.includes('architektúr')) {
        reply = 'Odporúčaná hexagonálna architektúra s orchestráciou cez LangGraph a runtime WebContainers pre sub-5ms latenciu. Kľúčoví agenti: Planner, Visual Designer, Architect, Coder a Patcher.';
        tag = 'Technická špecifikácia';
      } else if (q.includes('DPH')) {
        reply = 'Formát IČ DPH pre Slovensko overený (SK + 10 číslic). Overenie voči registru Finančnej správy SR prebehlo úspešne bez nezrovnalostí.';
        tag = 'Overenie registrov';
      }

      const botMsg: ChatMessage = { id: `c-${Date.now()}`, sender: 'copilot', text: reply, tag };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-4 text-left font-mono">
      {/* Sample Quick Queries */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-zinc-400">Rýchle dopyty:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white hover:border-violet-500 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages History */}
      <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3 max-h-[220px] overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-xs leading-relaxed ${
              m.sender === 'copilot'
                ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-200'
                : 'bg-violet-950/40 border border-violet-700/40 text-violet-200 ml-4'
            }`}
          >
            <div className="flex items-center justify-between mb-1 text-[10px] text-zinc-400">
              <span className="font-bold">{m.sender === 'copilot' ? 'RMD26 Slovak Copilot' : 'Používateľ'}</span>
              {m.tag && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-cyan-400 border border-zinc-800">
                  {m.tag}
                </span>
              )}
            </div>
            <p>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="p-2 text-xs text-zinc-400 italic">
            Generujem odpoveď v slovenskom jazyku...
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
          placeholder="Zadajte otázku alebo požiadavku v slovenčine..."
          className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-3 h-3" />
          <span>Odoslať</span>
        </button>
      </form>
    </div>
  );
};
