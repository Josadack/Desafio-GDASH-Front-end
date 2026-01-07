// src/components/profile/UserList.tsx
import { useEffect, useState, useContext } from "react";
import api from "../../services/Api"; // se você usa a função buscar, pode usar ela também
import { AuthContext } from "../../contexts/AuthContext";

import UserSearch from "./UserSearch";
import { ToastAlerta } from "../../utils/ToastAlerta";
import type { Users } from "../../model/Users";
import UserCard from "./UsersCard";


export default function UserList() {
  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario?.token ?? "";
  const [users, setUsers] = useState<Users[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // só carregar quando tivermos token
    if (!token) return;

    let mounted = true;
    async function load() {
      try {
        const res = await api.get("/api/users/all", {
          headers: { Authorization: token },
        });
        if (!mounted) return;
        setUsers(res.data);
      } catch (err: any) {
        console.error("Erro ao carregar usuários", err);
        // Se for 401, limpa o contexto e redireciona no AuthContext ou aqui
        if (err?.response?.status === 401) {
          ToastAlerta("Sessão expirada. Faça login novamente.", "info");
          handleLogout();
        } else {
          ToastAlerta("Erro ao carregar usuários", "erro");
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [token, handleLogout]);

  // busca segura: transforma id (number) em string antes de usar includes
  const filtered = users.filter((u) => {
    const nameMatch = u.name?.toLowerCase().includes(search.toLowerCase());
    const idStr = u.id !== undefined && u.id !== null ? String(u.id) : "";
    const idMatch = idStr.includes(search);
    return nameMatch || idMatch;
  });

  return (
    <div>
      <UserSearch search={search} setSearch={setSearch} />

      <div className="mt-6">
        {filtered.length === 0 ? (
          <p className="text-blue-800">Nenhum usuário encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((u) => (
              <UserCard key={u.id ?? u.id ?? JSON.stringify(u)} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
