import { Users, UserCheck } from "lucide-react";
import { CardDashboard } from "./CardDashboard";

interface Props {
  total: number;
}

export function UsersTotalCard({ total }: Props) {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;

  const userIcon = isNight ? (
    <UserCheck
      size={32}
      className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]"
    />
  ) : (
    <Users
      size={32}
      className="text-blue-400 drop-shadow-[0_0_6px_rgba(197, 105, 0, 0.6)]"
    />
  );

  return (
    <CardDashboard
      title="Usuários Totais"
      icon={userIcon}
    >
      <p
        className="text-3xl font-extrabold text-[#3B82F6]"
        title="Total de usuários cadastrados no sistema"
      >
        {total}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        usuários cadastrados
      </p>
    </CardDashboard>
  );
}
