// import type { ExplorerItem } from "../../model/Explorer";


// interface ExplorerTableProps {
//   data: ExplorerItem[];
//   onSelect?: (item: ExplorerItem) => void;
//   emptyMessage?: string;
// }

// export function ExplorerTable({ data, onSelect, emptyMessage = "Nenhum item encontrado." }: ExplorerTableProps) {
//   if (!data || data.length === 0) {
//     return <p className="text-[#94A3B8]">{emptyMessage}</p>;
//   }

//   return (
//     <div className="w-full overflow-x-auto rounded-lg border border-white/6">
//       {/* Desktop table */}
//       <table className="min-w-full hidden md:table bg-transparent">
//         <thead>
//           <tr className="text-left text-sm text-[#94A3B8]">
//             <th className="px-4 py-3">Nome</th>
//             <th className="px-4 py-3">Descrição</th>
//             <th className="px-4 py-3">Tipo</th>
//             <th className="px-4 py-3">Criado em</th>
//             <th className="px-4 py-3">Ações</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((item) => (
//             <tr
//               key={item.id}
//               className="bg-transparent hover:bg-[#1E293B] transition-colors cursor-pointer"
//               onClick={() => onSelect?.(item)}
//             >
//               <td className="px-4 py-3 align-top">
//                 <div className="text-sm font-medium text-white">{item.image}</div>
//               </td>

//               <td className="px-4 py-3 align-top">
//                 <div className="text-sm text-[#94A3B8] max-w-xl truncate">{item.description ?? "-"}</div>
//               </td>

//               <td className="px-4 py-3 align-top">
//                 <span className="inline-block text-xs px-2 py-1 rounded-md bg-[#3B82F6] text-white">
//                   {item.type ?? "-"}
//                 </span>
//               </td>

//               <td className="px-4 py-3 align-top">
//                 <div className="text-sm text-[#94A3B8]">
//                   {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
//                 </div>
//               </td>

//               <td className="px-4 py-3 align-top">
//                 <button
//                   onClick={(e) => { e.stopPropagation(); onSelect?.(item); }}
//                   className="px-3 py-1 rounded-md bg-[#3B82F6] text-white text-sm hover:brightness-95 transition"
//                 >
//                   Detalhes
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Mobile card list */}
//       <div className="md:hidden space-y-3">
//         {data.map((item) => (
//           <div
//             key={item.id}
//             onClick={() => onSelect?.(item)}
//             className="p-4 bg-[#1E293B] rounded-lg border border-white/6 transition transform hover:scale-[1.01] cursor-pointer"
//           >
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="text-white font-semibold">{item.name}</h3>
//                 {item.description && <p className="text-[#94A3B8] text-sm mt-1 line-clamp-2">{item.description}</p>}
//               </div>

//               <div className="ml-4 text-right">
//                 <div className="text-sm text-[#94A3B8]">{item.type ?? "-"}</div>
//                 <div className="text-xs text-[#94A3B8] mt-2">
//                   {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
