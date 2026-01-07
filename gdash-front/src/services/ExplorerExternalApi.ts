import type { ExplorerItem } from "../model/Explorer";

interface ApiResponse {
  items: ExplorerItem[];
  totalPages: number;
  totalItems?: number;
}

export async function getExplorerExternalData(
  page: number,
  limit: number,
  search: string = ""
): Promise<ApiResponse> {
  try {
    const query = search ? `&name=${search}` : "";
    const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}${query}`);
    if (!res.ok) throw new Error("Erro ao buscar dados da API");

    const data = await res.json();

    // Mapear para ExplorerItem e respeitar o limit
    const items: ExplorerItem[] = data.results.slice(0, limit).map((char: any) => ({
      id: char.id,
      name: char.name,
      description: `${char.species} - ${char.status}`,
      type: char.species,
      status: char.status,
      createdAt: new Date().toISOString(),
      image: char.image
    }));

    return {
      items,
      totalPages: data.info.pages,
      totalItems: data.info.count
    };
  } catch (err) {
    console.error(err);
    return { items: [], totalPages: 1, totalItems: 0 };
  }
}
