import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";
import { atualizar, buscar } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

export default function Profile() {
  const { usuario, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: ""
  });

  const [search, setSearch] = useState("");

  // Carrega dados do usuário logado ao abrir a página
  useEffect(() => {
    if (!usuario?.id) return;

    buscar(
      `/api/users/${usuario.id}`,
      (data: any) => {
        setForm({
          id: data.id,
          name: data.name,
          email: data.email,
          password: ""
        });
      },
      { headers: { Authorization: usuario.token } }
    );
  }, [usuario]);

  // Atualiza inputs
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Atualiza campo de busca
  function handleSearchChange(e: any) {
    setSearch(e.target.value);
  }

  // Função para buscar por ID ou por nome
  async function buscarUsuario() {
    if (!search.trim()) return;

    // Buscar por ID
    if (!isNaN(Number(search))) {
      try {
        await buscar(
          `/api/users/${search}`,
          (data: any) => {
            setForm({
              id: data.id,
              name: data.name,
              email: data.email,
              password: ""
            });
          },
          { headers: { Authorization: usuario.token } }
        );
      } catch {
        ToastAlerta("Usuário não encontrado", "info");
      }
      return;
    }

    // Buscar por nome usando /all e filtrando localmente
    try {
      await buscar(
        `/api/users/all`,
        (lista: any[]) => {
          const filtrado = lista.find((u) =>
            u.name.toLowerCase().includes(search.toLowerCase())
          );

          if (!filtrado) {
            ToastAlerta("Nenhum usuário encontrado pelo nome", "info");
            return;
          }

          setForm({
            id: filtrado.id,
            name: filtrado.name,
            email: filtrado.email,
            password: ""
          });
        },
        { headers: { Authorization: usuario.token } }
      );
    } catch (err) {
      ToastAlerta("Erro ao buscar usuário", "erro");
    }
  }

  async function salvar() {
    try {
      await atualizar(`/api/users/update/${form.id}`, form, () => { }, {
        headers: { Authorization: usuario.token }
      });

      ToastAlerta("Perfil atualizado com sucesso!", "sucesso");
      navigate("/dashboard");
    } catch {
      ToastAlerta("Erro ao atualizar perfil", "erro");
    }
  }

  async function excluirConta() {
    if (!confirm("Tem certeza que deseja excluir sua conta?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/users/delete/${form.id}`, {
        method: "DELETE",
        headers: { Authorization: usuario.token }
      });

      ToastAlerta("Conta excluída.", "sucesso");
      handleLogout();
      navigate("/login");
    } catch {
      ToastAlerta("Erro ao excluir conta.", "erro");
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center bg-[#0a0f1f] p-6">

        {/* Cabeçalho do Perfil */}
        <div className="w-full max-w-lg mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
            {form.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Meu Perfil</h2>
            <p className="text-sm text-slate-400">
              Gerencie suas informações pessoais e segurança
            </p>
          </div>
        </div>

        {/* Card Perfil */}
        <div className="w-full max-w-lg bg-[#141c2e] p-6 rounded-xl shadow-lg text-white">
          <label className="block mb-1 text-sm text-slate-400">Nome</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2.5 mb-4 rounded bg-[#1e293b] text-white"
          />

          <label className="block mb-1 text-sm text-slate-400">Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2.5 mb-4 rounded bg-[#1e293b] text-white"
          />

          <label className="block mb-1 text-sm text-slate-400">Nova Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2.5 mb-4 rounded bg-[#1e293b] text-white"
          />

          <div className="flex justify-between items-center mt-6">
            <button
              className="bg-gray-600 px-5 py-2 rounded"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </button>

            <button
              className="bg-blue-600 px-5 py-2 rounded"
              onClick={salvar}
            >
              Salvar
            </button>
          </div>
        </div>
        {/* Zona de Perigo */}
        <div className="w-full max-w-lg mt-8 border border-red-500/30 rounded-lg p-4 bg-red-500/5">
          <h3 className="text-red-400 font-semibold mb-2">Zona de Perigo</h3>

          <p className="text-sm text-slate-400 mb-4">
            Excluir sua conta é uma ação permanente e não pode ser desfeita.
          </p>

          <button
            onClick={excluirConta}
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            Excluir minha conta
          </button>
        </div>

      </div>
    </>
  );
}
