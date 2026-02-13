export async function GET() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/search?q=base",
      { cache: "no-store" }
    );

    const data = await res.json();

    // New pools = recently created pairs
    const newPools =
      data.pairs
        ?.filter((p: any) => {
          const ageMinutes =
            (Date.now() - (p.pairCreatedAt || 0)) / 60000;

          return ageMinutes < 180; // last 3 hours pools
        })
        ?.slice(0, 10) || [];

    return Response.json({ newPools });
  } catch {
    return Response.json({ newPools: [] });
  }
}
