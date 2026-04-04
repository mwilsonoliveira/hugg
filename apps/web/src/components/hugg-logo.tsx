import { FaPaw } from "react-icons/fa";

export function HuggLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-end gap-0.5 ${className ?? ""}`}>
      {/* <FaPaw className="w-4 h-4 rotate-12 mb-1 text-current" /> */}
      <FaPaw className="w-5 h-5 -rotate-6 text-current" />
    </div>
  );
}
