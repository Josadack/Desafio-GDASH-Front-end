
import { useState, useEffect, useContext } from "react";
import api, { atualizar, buscar,  } from "../../services/Api";
import { ToastAlerta } from "../../utils/ToastAlerta";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface Props {
  usuario: {
    id: number;
    token: string;
  };
}

export default function ProfileForm({ usuario }: Props) {
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Buscar dados do usuário
  useEffect(() => {
    if (usuario.id) {
      buscar(`/api/users/${usuario.id}`, setForm, {
        headers: { Authorization: usuario.token },
      }).catch(() => {
        ToastAlerta("Erro ao carregar dados do usuário", "erro");
      });
    }
  }, [usuario]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await atualizar(`/api/users/update/${usuario.id}`, form, setForm, {
        headers: { Authorization: usuario.token },
      });

      ToastAlerta("Dados atualizados com sucesso!", "sucesso");
      navigate("/dashboard"); // REDIRECIONA após salvar
    } catch (err) {
      ToastAlerta("Erro ao atualizar!", "erro");
    } finally {
      setLoading(false);
    }
  }

  // Deletar conta
  async function handleDelete() {
    const ok = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );
    if (!ok) return;

    setLoading(true);
    try {
      // usa a sua instância axios registrada em services/Api (api)
      await api.delete(`/users/delete/${usuario.id}`, {
        headers: { Authorization: usuario.token },
      });

      ToastAlerta("Conta excluída com sucesso.", "sucesso");

      // limpa armazenamento e contexto
      handleLogout();

      // redireciona para login (ou /)
      navigate("/login");
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      ToastAlerta("Erro ao excluir a conta. Tente novamente.", "erro");
    } finally {
      setLoading(false);
    }
  }

  function cancelar() {
    navigate("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      {/* Nome */}
      <div>
        <label className="block mb-1 font-medium">Nome</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Senha */}
      <div>
        <label className="block mb-1 font-medium">Senha</label>
        <input
          type="password"
          name="password"
          placeholder="Digite uma nova senha"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4 pt-3">
        <button
          type="button"
          onClick={cancelar}
          className="w-1/3 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold"
          disabled={loading}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="w-1/3 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>

        {/* Botão de Excluir */}
        <button
          type="button"
          onClick={handleDelete}
          className="w-1/3 py-3 bg-orange-400 hover:bg-orange-700 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Processando..." : "Excluir Conta"}
        </button>
      </div>
    </form>
  );
}
