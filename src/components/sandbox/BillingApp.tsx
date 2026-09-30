import React, { useState } from 'react';
import { CreditCard, Check, Download, Zap, CheckCircle2 } from 'lucide-react';

export const BillingApp: React.FC = () => {
  const [seats, setSeats] = useState(25);
  const [tier, setTier] = useState<'starter' | 'scale' | 'enterprise'>('scale');
  const [isAnnual, setIsAnnual] = useState(true);
  const [invoiceCreated, setInvoiceCreated] = useState<string | null>(null);

  const pricePerSeat = tier === 'starter' ? 19 : tier === 'scale' ? 39 : 79;
  const rawTotal = seats * pricePerSeat;
  const discountedTotal = isAnnual ? Math.round(rawTotal * 0.8) : rawTotal;

  const handleCreateInvoice = () => {
    const invId = `INV-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
    setInvoiceCreated(`Invoice #${invId} synthesized & Stripe customer webhook dispatched.`);
    setTimeout(() => setInvoiceCreated(null), 5000);
  };

  return (
    <div className="space-y-5 text-left font-mono">
      {/* Tier Selector */}
      <div className="grid grid-cols-3 gap-3">
        {(['starter', 'scale', 'enterprise'] as const).map((t) => {
          const isSelected = tier === t;
          const cost = t === 'starter' ? '$19' : t === 'scale' ? '$39' : '$79';
          return (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-violet-500 bg-violet-950/30 text-white shadow-md shadow-violet-950/20'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider text-zinc-400">{t}</div>
              <div className="text-lg font-bold text-white mt-1">
                {cost}<span className="text-xs text-zinc-400 font-normal">/seat</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Seats Slider & Billing Frequency */}
      <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300">Active Developer Seats:</span>
          <span className="text-cyan-400 font-bold text-base">{seats} seats</span>
        </div>
        <input
          type="range"
          min={5}
          max={150}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full accent-cyan-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
          <span className="text-zinc-400">Billing Term:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-2.5 py-1 rounded text-[11px] ${!isAnnual ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1 ${isAnnual ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'text-zinc-400'}`}
            >
              <span>Annual</span>
              <span className="text-[9px] bg-emerald-500 text-zinc-950 font-bold px-1 rounded">-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Total Calculation & Action */}
      <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-zinc-400">ESTIMATED REVENUE / MO</span>
          <div className="text-2xl font-bold text-white mt-0.5">
            ${discountedTotal.toLocaleString()}
            <span className="text-xs text-zinc-400 font-normal"> / month</span>
          </div>
        </div>

        <button
          onClick={handleCreateInvoice}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Generate Invoice &amp; Test Webhook</span>
        </button>
      </div>

      {invoiceCreated && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{invoiceCreated}</span>
        </div>
      )}
    </div>
  );
};
