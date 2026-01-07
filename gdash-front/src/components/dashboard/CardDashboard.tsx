import type { ReactNode } from "react";

interface CardProps {
  title: string;
  icon?: ReactNode;
  value?: string | number;
  children?: ReactNode;
}

export function CardDashboard({ title, icon, value, children }: CardProps) {
  return (
    <div
      className="
      bg-[#1E293B] text-white
      border border-white/10 p-6 rounded-xl
      transition-all duration-300
      hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)]
      "
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {icon && <div className="p-2 bg-white/10  rounded-xl">{icon}</div>}
      </div>

      {children ? (
        <div>{children}</div>
      ) : (
        <p className="text-4xl font-extrabold text-[#3B82F6]">{value}</p>
      )}
    </div>
  );
}
