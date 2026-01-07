// Um loader simples que fica por cima do conteúdo sem removê-lo
export function SearchOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a]/60 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-blue-400 font-medium animate-pulse">
        Processando dados climáticos...
      </p>
    </div>
  );
}