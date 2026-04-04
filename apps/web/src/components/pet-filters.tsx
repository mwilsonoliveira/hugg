"use client";

interface PetFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  waitingFilter: string;
  onWaitingFilterChange: (value: string) => void;
}

const WAITING_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "7", label: "Até 7 dias" },
  { value: "30", label: "Até 30 dias" },
  { value: "90", label: "Até 90 dias" },
  { value: "90+", label: "Mais de 90 dias" },
];

export function PetFilters({
  search,
  onSearchChange,
  waitingFilter,
  onWaitingFilterChange,
}: PetFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Botão Achei um pet */}
      <button className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        Achei um pet!
      </button>

      {/* Campo de busca */}
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nome ou raça..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
      </div>

      {/* Dropdown filtro de espera */}
      <div className="relative shrink-0">
        <select
          value={waitingFilter}
          onChange={(e) => onWaitingFilterChange(e.target.value)}
          className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent cursor-pointer"
        >
          {WAITING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
