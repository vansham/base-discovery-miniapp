export async function GET() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/search?q=base",
      { cache: "no-store" }
    );

    const data = await res.json();

    const whales =
      data.pairs
        ?.filter((p: any) => (p?.liquidity?.usd || 0) > 50000)
        ?.slice(0, 5) || [];

    return Response.json({ whales });
  } catch {
    return Response.json({ whales: [] });
  }
}
