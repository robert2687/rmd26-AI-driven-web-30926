import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Zap, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export const CryptoArbitrageApp: React.FC = () => {
  const [ethPrice, setEthPrice] = useState(3420.50);
  const [spread, setSpread] = useState(0.42);
  const [txLog, setTxLog] = useState<{ id: string; route: string; profit: string; time: string }[]>([
    { id: 'tx-1', route: 'Uniswap v3 ➔ Binance', profit: '+$142.80', time: '12s ago' },
    { id: 'tx-2', route: 'Curve Finance ➔ Kraken', profit: '+$84.10', time: '45s ago' }
  ]);
  const [executing, setExecuting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Simulated live price ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setEthPrice((prev) => {
        const delta = (Math.random() - 0.48) * 4.5;
        return Number((prev + delta).toFixed(2));
      });
      setSpread(Number((0.35 + Math.random() * 0.25).toFixed(2)));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleExecuteArbitrage = () => {
    setExecuting(true);
    setSuccessNotice(null);
    setTimeout(() => {
      const profitVal = (Math.random() * 90 + 60).toFixed(2);
      const newTx = {
        id: `tx-${Date.now()}`,
        route: 'Uniswap v3 ➔ Binance',
        profit: `+$${profitVal}`,
        time: 'Just now'
      };
      setTxLog((prev) => [newTx, ...prev.slice(0, 4)]);
      setExecuting(false);
      setSuccessNotice(`Arbitrage executed: $${profitVal} profit captured across DEX/CEX pool.`);
    }, 700);
  };

  return (
    <div className="space-y-5 text-left font-mono">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
          <div className="text-[11px] text-zinc-400">ETH/USDT (AGGREGATED)</div>
          <div className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <span>${ethPrice.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 flex items-center font-normal">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +1.4%
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
          <div className="text-[11px] text-zinc-400">CROSS-EXCHANGE SPREAD</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">
            {spread}% <span className="text-xs text-zinc-400 font-normal">($14.36 delta)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-zinc-400">EXECUTION ROUTE</div>
            <div className="text-xs font-bold text-violet-300 mt-1">Uniswap ➔ Binance</div>
          </div>
          <button
            onClick={handleExecuteArbitrage}
            disabled={executing}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {executing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
            <span>{executing ? 'Executing...' : 'Trigger'}</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Order Book & Execution Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order Book Depth */}
        <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-2">
            <span>DEX POOL DEPTH</span>
            <span>LIQUIDITY ($M)</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-emerald-400">
              <span>Uniswap v3 (0.05%)</span>
              <span className="font-bold">$42.8M</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400/90">
              <span>Curve stETH/ETH</span>
              <span className="font-bold">$18.4M</span>
            </div>
            <div className="flex justify-between items-center text-rose-400">
              <span>Binance Order Book</span>
              <span className="font-bold">$84.1M</span>
            </div>
          </div>
        </div>

        {/* Live Execution Ledger */}
        <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-2">
            <span>RECENT ARBITRAGE EXECUTIONS</span>
            <span className="text-emerald-400">NET GAIN</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {txLog.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center text-zinc-300">
                <span className="truncate max-w-[160px] text-zinc-400">{tx.route}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-500">{tx.time}</span>
                  <span className="text-emerald-400 font-bold">{tx.profit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
