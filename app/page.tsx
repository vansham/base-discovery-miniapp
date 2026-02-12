"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPairs() {
    try {
      // Base chain pairs from Dexscreener
      const res = await fetch(
        "https://api.dexscreener.com/latest/dex/pairs/base"
      );
      const data = await res.json();

      // show top 10 recent
      setPairs(data.pairs?.slice(0, 10) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPairs();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Base New Liquidity</h1>

      {loading && <p>Loading real Base DEX data...</p>}

      <div className="grid gap-4">
        {pairs.map((p, i) => (
          <div key={i} className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-lg font-bold">
              {p.baseToken?.symbol} / {p.quoteToken?.symbol}
            </p>

            <p>DEX: {p.dexId}</p>
            <p>Liquidity: ${p.liquidity?.usd?.toLocaleString()}</p>
            <p>Price: ${p.priceUsd}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
