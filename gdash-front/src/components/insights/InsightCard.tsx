interface InsightCardProps {
  title: string;
  value: string | number;
}

export function InsightCard({ title, value }: InsightCardProps) {
  return (
    <div className="bg-[#1E293B] p-4 rounded-xl text-white shadow-md flex flex-col items-center">
      <span className="text-sm text-gray-400">{title}</span>
      <span className="text-xl font-bold mt-2">{value}</span>
    </div>
  );
}
