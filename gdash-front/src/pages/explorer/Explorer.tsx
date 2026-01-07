import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState, useEffect } from "react";
import { ExplorerCard } from "../../components/explorer/ExplorerCard";
import { ExplorerPagination } from "../../components/explorer/ExplorerPagination";
import type { ExplorerItem } from "../../model/Explorer";
import { getExplorerExternalData } from "../../services/ExplorerExternalApi";

export default function Explorer() {
  const [itens, setItens] = useState<ExplorerItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, [page, search]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getExplorerExternalData(page, limit, search);
      setItens(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems || data.items.length);
    } catch (err) {
      console.error("Erro ao carregar Explorer", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col">
      
      {/* SVG de background */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1500" className="w-full h-full">
          <rect fill="#ffffff" width="2000" height="1500" />
          <defs>
            <rect stroke="#ffffff" strokeWidth=".5" width="1" height="1" id="s" />
            <pattern id="a" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="scale(50) translate(-980 -735)">
              <use fill="#fcfcfc" href="#s" y="2" />
              <use fill="#fcfcfc" href="#s" x="1" y="2" />
              <use fill="#fafafa" href="#s" x="2" y="2" />
              <use fill="#fafafa" href="#s" />
              <use fill="#f7f7f7" href="#s" x="2" />
              <use fill="#f7f7f7" href="#s" x="1" y="1" />
            </pattern>
            {/* repita para os outros patterns b, h, c, d, e, f, g */}
          </defs>
          <rect fill="url(#a)" width="100%" height="100%" />
          {/* repita para os outros patterns */}
        </svg>
      </div>

      {/* Conteúdo principal */}
      <h1 className="text-xl sm:text-2xl text-slate-800 font-bold mb-2">Explorer</h1>

      <p className="text-sm text-slate-400 mb-4">
        Os personagens exibidos aqui são obtidos da <strong>API pública Rick and Morty</strong>. 
        Você pode buscar por nome e navegar entre as páginas para explorar todos os personagens.
      </p>

      <p className="text-sm text-slate-400 mb-4">
        Total de personagens: {totalItems}
      </p>

      <input
        type="text"
        placeholder="Buscar personagem"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 rounded-md w-full sm:w-1/2 border border-b-cyan-950"
      />

      {loading ? (
        <p className="text-gray-800 text-sm">
          <DotLottieReact
            src="https://lottie.host/83b70c3c-2ba5-4fe3-be93-6470c1b872fa/P6gjWTzhw3.lottie"
            loop
            autoplay
          />
        </p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {itens.map((item) => (
            <ExplorerCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <ExplorerPagination page={page} totalPages={totalPages} onChangePage={setPage} />
      </div>
    </div>
  );
}
