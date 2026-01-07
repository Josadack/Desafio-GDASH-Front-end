import type { ExplorerItem } from "../../model/Explorer";

interface Props {
  item: ExplorerItem;
}

export function ExplorerCard({ item }: Props) {
  // Definir cor da badge pelo status
  const statusColor =
    item.status === "Alive"
      ? "bg-green-500"
      : item.status === "Dead"
      ? "bg-red-500"
      : "bg-gray-500";

  return (
    <div className="flex bg-[#1E293B] p-4 rounded-xl shadow-md border border-white/10 hover:border-[#3B82F6] hover:shadow-lg transition cursor-pointer"
    >
      {item.image && (
        <img
          src={item.image}
          alt={`Imagem do personagem ${item.name}`}
          className="w-24 h-24 object-cover rounded-md shrink-0"
        />
      )}

      <div className="ml-4 flex flex-col justify-between">
        <div>
          <h3 className="text-white text-md font-semibold">{item.name}</h3>
          {item.description && (
            <p className="text-[#94A3B8] text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-2 items-center">
          {item.type && (
            <span className="inline-block text-xs bg-[#3B82F6] px-2 py-1 rounded-md text-white">
              {item.type}
            </span>
          )}
          {item.status && (
            <span className={`inline-block text-xs px-2 py-1 rounded-md text-white ${statusColor}`}>
              {item.status}
            </span>
          )}
          <span className="text-[#94A3B8] text-xs">
            Criado em: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
