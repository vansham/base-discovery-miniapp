export async function GET() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/search?q=base",
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "fetch failed" }, { status: 500 });
  }
}
