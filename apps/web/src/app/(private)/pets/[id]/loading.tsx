export default function PetDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="w-20 h-8 rounded-lg bg-gray-200" />
        </div>

        {/* Carrossel */}
        <div className="rounded-2xl overflow-hidden mb-6 bg-gray-200 h-80" />

        {/* Nome e situação */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="h-7 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>

        {/* Informações */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
          <div className="h-3 w-4/6 bg-gray-200 rounded" />
        </div>
      </div>
    </main>
  );
}
