export async function GET() {
  try {

    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/search?q=base",
      {
        cache: "no-store"
      }
    );

    const data = await res.json();

    // SAFE NEW POOLS FILTER
    const newPools =
      data.pairs
        ?.filter((p: any) => {

          // pairCreatedAt nahi hai → skip
          if (!p.pairCreatedAt) return false;

          const ageMinutes =
            (Date.now() - p.pairCreatedAt) / 60000;

          // Last 7 Days pools
          return ageMinutes < 10080;

        })
        ?.slice(0, 10) || [];

    return Response.json({ newPools });

  } catch (e) {

    return Response.json({
      newPools: []
    });

  }
}
