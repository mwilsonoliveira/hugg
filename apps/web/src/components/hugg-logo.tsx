export function HuggLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 40"
      fill="currentColor"
      className={className}
      aria-label="hugg logo"
    >
      {/* Patinha esquerda — menor, mais acima, girada ~20° para a direita */}
      <g transform="translate(4, 2) rotate(18, 11, 20) scale(0.78)">
        {/* Palma */}
        <ellipse cx="11" cy="22" rx="7" ry="8.5" />
        {/* Dedos */}
        <ellipse cx="4.5" cy="13" rx="2.8" ry="3.5" />
        <ellipse cx="9"   cy="11" rx="2.8" ry="3.5" />
        <ellipse cx="13.5" cy="11" rx="2.8" ry="3.5" />
        <ellipse cx="18"  cy="13" rx="2.8" ry="3.5" />
      </g>

      {/* Patinha direita — maior, mais abaixo, reta */}
      <g transform="translate(27, 5)">
        {/* Palma */}
        <ellipse cx="12" cy="24" rx="8.5" ry="10" />
        {/* Dedos */}
        <ellipse cx="4.5" cy="13.5" rx="3.3" ry="4.2" />
        <ellipse cx="9.5" cy="11"   rx="3.3" ry="4.2" />
        <ellipse cx="14.5" cy="11"  rx="3.3" ry="4.2" />
        <ellipse cx="19.5" cy="13.5" rx="3.3" ry="4.2" />
      </g>
    </svg>
  );
}
