"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [whales, setWhales] = useState<any[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);

  async function fetchAll() {
    const p = await fetch("/api/dex").then(r => r.json());
    const w = await fetch("/api/smart").then(r => r.json());
    setPairs(p.pairs || []);
    setWhales(w.whales || []);
  }

  async function connectWallet() {
    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setWallet(accounts[0]);
    } catch {}
  }

  useEffect(() => {
    fetchAll();
    const i = setInterval(fetchAll, 30000); // Auto refresh 30s
    return () => clearInterval(i);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8 space-y-8">

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Base Discovery + Smart Flow</h1>

        <button
          onClick={connectWallet}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          {wallet ? wallet.slice(0,6)+"..." : "Connect Base Wallet"}
        </button>
      </div>

      {/* Smart Wallet Signals */}
      <div>
        <h2 className="text-xl mb-3 text-green-400">Smart Liquidity Signals</h2>
        <div className="grid gap-3">
          {whales.map((w,i)=>(
            <div key={i} className="bg-zinc-900 p-4 rounded">
              <p>{w.baseToken?.symbol}/{w.quoteToken?.symbol}</p>
              <p>Liquidity: ${Number(w.liquidity?.usd||0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Pools */}
      <div>
        <h2 className="text-xl mb-3">High Liquidity Base Pools</h2>
        <div className="grid gap-3">
          {pairs.map((p,i)=>(
            <div key={i} className="bg-zinc-900 p-4 rounded">
              <p>{p.baseToken?.symbol}/{p.quoteToken?.symbol}</p>
              <p>DEX: {p.dexId}</p>
              <p>Liquidity: ${Number(p.liquidity?.usd||0).toLocaleString()}</p>
              <p>Price: ${p.priceUsd}</p>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
