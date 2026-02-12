export async function GET() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/search?q=base",
      { cache: "no-store" }
    );
    const data = await res.json();

    // Filter: only higher liquidity pools (example > $50k)
    const pairs =
      data.pairs?.filter((p: any) => (p?.liquidity?.usd || 0) > 50000) || [];

    return Response.json({ pairs });
  } catch (e) {
    return Response.json({ pairs: [] }, { status: 200 });
  }
}
