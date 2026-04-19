"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface UnsavedChangesContextValue {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  requestNavigation: (navigate: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue>({
  isDirty: false,
  setIsDirty: () => {},
  requestNavigation: (navigate) => navigate(),
});

export function useUnsavedChanges() {
  return useContext(UnsavedChangesContext);
}

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);

  const requestNavigation = (navigate: () => void) => {
    if (isDirty) {
      setPendingNav(() => navigate);
    } else {
      navigate();
    }
  };

  const handleDiscard = () => {
    setIsDirty(false);
    pendingNav?.();
    setPendingNav(null);
  };

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setIsDirty, requestNavigation }}>
      {children}

      {pendingNav && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Descartar alterações?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              As informações preenchidas serão perdidas.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDiscard}
                className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Descartar
              </button>
              <button
                onClick={() => setPendingNav(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
              >
                Continuar editando
              </button>
            </div>
          </div>
        </div>
      )}
    </UnsavedChangesContext.Provider>
  );
}
