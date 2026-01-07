
import type { MouseEventHandler } from "react";

interface ExportButtonProps {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: "blue" | "orange"; // pra manter as cores do tema
}

export function ExportButton({ label, onClick, color = "blue" }: ExportButtonProps) {
  const bgColor = color === "blue" ? "bg-[#3B82F6]" : "bg-[#F97316]";
  const hoverColor = color === "blue" ? "hover:bg-[#2563EB]" : "hover:bg-[#EA580C]"; // tom laranja escuro no hover
  const shadowColor = color === "blue" ? "rgba(59,130,246,0.25)" : "rgba(249,115,22,0.25)";

  return (
    <button
      onClick={onClick}
      className={`
        ${bgColor} ${hoverColor} text-white font-semibold px-4 py-2 rounded-xl
        border border-white/10
        transition-all duration-300
         hover:scale-[1.02] hover:shadow-[0_4px_20px_${shadowColor}]
      `}
    >
      {label}
    </button>
  );
}
