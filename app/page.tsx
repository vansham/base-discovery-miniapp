export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Base Early Discovery
      </h1>

      <div className="bg-zinc-900 p-6 rounded-xl">
        <h2 className="text-2xl mb-4">New Base Tokens</h2>

        <div className="space-y-2">
          <div className="p-3 bg-zinc-800 rounded">
            Token data loading...
          </div>
        </div>
      </div>
    </main>
  );
}
