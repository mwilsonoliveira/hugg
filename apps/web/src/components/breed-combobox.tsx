"use client";

import { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { BREEDS_BY_SPECIES, type Species } from "@hugg/schemas";

interface BreedComboboxProps {
  species: Species | "";
  value: string;
  onChange: (value: string | undefined) => void;
  error?: string;
}

export function BreedCombobox({ species, value, onChange, error }: BreedComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const breeds = useMemo<readonly string[]>(() => {
    if (!species || species === "OTHER") return [];
    return BREEDS_BY_SPECIES[species] ?? [];
  }, [species]);

  const filtered = useMemo(() => {
    if (!query) return breeds;
    return breeds.filter((b) => b.toLowerCase().includes(query.toLowerCase()));
  }, [breeds, query]);

  const disabled = !species || species === "OTHER" || breeds.length === 0;
  const displayValue = value;

  const handleSelect = (breed: string) => {
    onChange(breed === value ? undefined : breed);
    setQuery("");
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Raça</label>
      <Popover.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors ${
              disabled
                ? "border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                : "border-gray-200 text-gray-700 hover:border-gray-300 cursor-pointer"
            } ${error ? "border-red-400" : ""}`}
          >
            <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
              {displayValue || (disabled ? "Selecione uma espécie primeiro" : "Selecione a raça")}
            </span>
            <div className="flex items-center gap-1">
              {displayValue && !disabled && (
                <span
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 px-0.5 cursor-pointer"
                  aria-label="Limpar raça"
                >
                  ×
                </span>
              )}
              <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="z-50 w-[--radix-popover-trigger-width] rounded-xl border border-gray-100 bg-white shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
          >
            {/* Campo de busca */}
            <div className="px-2 py-1.5 border-b border-gray-100 mb-1">
              <input
                autoFocus
                type="text"
                placeholder="Buscar raça..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm outline-none placeholder:text-gray-400 text-gray-700"
              />
            </div>

            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-sm text-gray-400 text-center">Nenhuma raça encontrada</p>
              ) : (
                filtered.map((breed) => (
                  <button
                    key={breed}
                    type="button"
                    onClick={() => handleSelect(breed)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors text-left"
                  >
                    {breed}
                    {displayValue === breed && <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
