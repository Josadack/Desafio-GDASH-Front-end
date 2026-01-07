

interface ExplorerPaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (p: number) => void;
  compact?: boolean;
}

export function ExplorerPagination({ page, totalPages, onChangePage, compact = false }: ExplorerPaginationProps) {
  const prev = () => onChangePage(Math.max(1, page - 1));
  const next = () => onChangePage(Math.min(totalPages, page + 1));

  // Build a short page list (ex: 1 ... 4 5 6 ... 10)
  const getPageList = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // shows current -1, current, current+1

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${compact ? "text-sm" : ""}`}>
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-3 py-1 rounded-md bg-[#1E293B] text-white disabled:opacity-40 transition"
      >
        Anterior
      </button>

      <div className="flex items-center gap-2">
        {getPageList().map((p, idx) =>
          typeof p === "string" ? (
            <span key={idx} className="px-2 text-[#94A3B8]">{p}</span>
          ) : (
            <button
              key={idx}
              onClick={() => onChangePage(p)}
              className={`px-3 py-1 rounded-md transition ${
                p === page ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-[#F1F5F9]"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={next}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-md bg-[#3B82F6] text-white disabled:opacity-40 transition"
      >
        Próxima
      </button>
    </div>
  );
}
