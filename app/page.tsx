"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

export default function Home() {

  /* FARCASTER READY */
  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready()
        console.log("Farcaster Ready Sent")
      } catch (e) {
        console.error("Farcaster Ready Error:", e)
      }
    }
    init()
  }, [])

  const [pairs, setPairs] = useState<any[]>([])
  const [newPools, setNewPools] = useState<any[]>([])
  const [whales, setWhales] = useState<any[]>([])
  const [wallet, setWallet] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /* FETCH DATA */
  async function fetchAll() {
    try {
      setLoading(true)

      const p = await fetch("/api/dex").then(r => r.json())
      const w = await fetch("/api/smart").then(r => r.json())
      const n = await fetch("/api/newpools").then(r => r.json())

      setPairs(p.pairs || [])
      setWhales(w.whales || [])
      setNewPools(n.newPools || [])

    } catch (e) {
      console.log("Fetch error:", e)
    } finally {
      setLoading(false)
    }
  }

  /* WALLET CONNECT */
  async function connectWallet() {
    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })
      setWallet(accounts[0])
    } catch (e) {
      console.log(e)
    }
  }

  /* AUTO REFRESH */
  useEffect(() => {
    fetchAll()
    const i = setInterval(fetchAll, 30000)
    return () => clearInterval(i)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold">Base Alpha Discovery</h1>
          <p className="text-sm text-zinc-400">
            Smart Liquidity + New Pools + Signals
          </p>
        </div>

        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
          {wallet ? wallet.slice(0,6)+"..." : "Connect Base Wallet"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 p-6">
        <Stat label="Smart Signals" value={whales.length} />
        <Stat label="Pools Showing" value={pairs.length} />
        <Stat label="Status" value="Live" />
      </div>

      {loading && (
        <div className="p-6 text-zinc-400">
          Loading Base Alpha Data...
        </div>
      )}

      {/* NEW POOLS */}
      <Section title="🔥 New Pools (Early Alpha)">
        <div className="grid md:grid-cols-2 gap-4">
          {newPools.map((p,i)=>(
            <Card
              key={i}
              pair={`${p.baseToken?.symbol}/${p.quoteToken?.symbol}`}
              liq={p.liquidity?.usd}
              dex={p.dexId}
              price={p.priceUsd}
              createdAt={p.pairCreatedAt}
            />
          ))}
        </div>
      </Section>

      {/* SMART SIGNALS */}
      <Section title="Smart Liquidity Signals">
        <div className="grid md:grid-cols-2 gap-4">
          {whales.map((w,i)=>(
            <Card
              key={i}
              pair={`${w.baseToken?.symbol}/${w.quoteToken?.symbol}`}
              liq={w.liquidity?.usd}
            />
          ))}
        </div>
      </Section>

      {/* HIGH LIQ POOLS */}
      <Section title="High Liquidity Base Pools">
        <div className="grid md:grid-cols-2 gap-4">
          {pairs.map((p,i)=>(
            <Card
              key={i}
              pair={`${p.baseToken?.symbol}/${p.quoteToken?.symbol}`}
              liq={p.liquidity?.usd}
              dex={p.dexId}
              price={p.priceUsd}
            />
          ))}
        </div>
      </Section>

    </main>
  )
}

/* SECTION */
function Section({title, children}: any) {
  return (
    <div className="px-6 pb-6">
      <h2 className="text-xl text-green-400 mb-4">{title}</h2>
      {children}
    </div>
  )
}

/* CARD */
function Card({pair, liq, dex, price, createdAt}: any) {

  function getAge() {
    if (!createdAt) return ""
    const mins = Math.floor((Date.now() - createdAt) / 60000)
    if (mins < 60) return mins + " mins ago"
    const hrs = Math.floor(mins / 60)
    return hrs + " hrs ago"
  }

  return (
    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 hover:border-blue-500 transition">
      <div className="text-lg font-bold">{pair}</div>
      {dex && <div className="text-sm text-zinc-400">DEX: {dex}</div>}
      <div className="text-green-400 font-semibold">
        Liquidity: ${Number(liq||0).toLocaleString()}
      </div>
      {price && (
        <div className="text-sm text-zinc-400">
          Price: ${price}
        </div>
      )}
      {createdAt && (
        <div className="text-xs text-yellow-400 mt-1">
          Age: {getAge()}
        </div>
      )}
    </div>
  )
}

/* STAT */
function Stat({label, value}: any) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
      <div className="text-zinc-400 text-sm">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
