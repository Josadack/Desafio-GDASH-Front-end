import { Search } from "lucide-react";

interface SearchUserInputProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchUserInput({ search, setSearch }: SearchUserInputProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar usuário por nome ou ID..."
          className="
            w-full bg-white/5 text-white border border-white/10 
            rounded-xl py-2 pl-10 pr-4 placeholder-white/40 
            focus:outline-none focus:border-teal-500 transition
          "
        />
      </div>
    </div>
  );
}
