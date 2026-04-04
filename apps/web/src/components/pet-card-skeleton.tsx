export function PetCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
      <div className="bg-gray-200" style={{ height: "180px" }} />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
