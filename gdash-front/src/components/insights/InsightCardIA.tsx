interface Props {
  title: string;
  value: string;
}

export function InsightCardIA({ title, value }: Props) {
  return (
    <div className="p-4 bg-[#1E293B] border border-white/10 rounded-xl shadow-md text-white transition hover:scale-[1.02]">
      <h3 className="text-sm text-[#94A3B8]">{title}</h3>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
