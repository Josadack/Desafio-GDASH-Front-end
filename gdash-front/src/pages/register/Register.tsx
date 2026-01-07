import { useNavigate, useParams } from "react-router-dom";
import type { Users } from "../../model/Users";
import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";
import { atualizar, buscar, cadastrarUsuario } from "../../services/Api";
import { RotatingLines } from "react-loader-spinner";

function Register() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { usuario, handleLogout, handleLogin } = useContext(AuthContext);

  const token = usuario?.token ?? "";

  const [usuarios, setUsuarios] = useState<Users>({
    id: 0,
    name: "",
    email: "",
    password: "",

  });


  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Busca usuário por ID (apenas para edição)
  async function buscarUsuarioPorId(id: string) {
    if (!token) return;
    try {
      await buscar(`/usuarios/${id}`, setUsuarios, {
        headers: { authorization: token },
      });
    } catch (error: any) {
      if (error.toString().includes("401")) {
        handleLogout();
      } else {
        ToastAlerta("Erro ao buscar usuário", "erro");
      }
    }
  }

  useEffect(() => {
    if (id && token) {
      buscarUsuarioPorId(id);
    }
  }, [id, token]);

  useEffect(() => {
    if (usuario?.id && !id) {
      buscarUsuarioPorId(usuario.id.toString());
    }
  }, [usuario, id]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarios({
      ...usuarios,
      [e.target.name]: e.target.value,
    });
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(e.target.value);
  }

  function retornar() {
    navigate('/login');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (confirmarSenha !== usuarios.password || usuarios.password.length < 8) {
      ToastAlerta('Senha inválida ou não confere com a confirmação', 'info');
      setUsuarios({ ...usuarios, password: '' });
      setConfirmarSenha('');
      setIsLoading(false);
      return;
    }

    try {
      if (id) {
        // ATUALIZAR
        await atualizar(`/api/users/update/${id}`, usuarios, setUsuarios, {
          headers: { Authorization: token }
        });
        ToastAlerta("Usuário atualizado com sucesso!", "sucesso");
      } else {
        // CADASTRAR
        await cadastrarUsuario("/api/users/auth/register", usuarios, setUsuarios);
        ToastAlerta("Usuário cadastrado com sucesso!", "sucesso");
      }

      retornar();
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout();
      } else {
        ToastAlerta('Erro ao salvar usuário', 'erro');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Lado esquerdo - decorativo */}
      <div className="lg:w-1/2 flex items-center justify-center bg-slate-900 text-white p-10 relative">
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-4xl font-bold text-orange-400">Bem-vindo!</h1>
          <p className="text-xl text-slate-300">Preencha os dados para <span className="font-bold">cadastrar</span> ou atualizar seu perfil</p>
        </div>
        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-2 border-orange-600 opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-orange-400 opacity-10"></div>
      </div>

      {/* Lado direito - formulário */}
      <div className="lg:w-1/2 flex items-center justify-center bg-white p-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-6 p-8 rounded-2xl shadow-lg bg-white"
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            {id || token ? "Editar Usuário" : "Cadastro de Usuário"}
          </h2>

          <div className="flex flex-col">
            <label className="text-slate-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              required
              value={usuarios.name}
              onChange={atualizarEstado}
              className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              value={usuarios.email}
              onChange={atualizarEstado}
              className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-700 mb-1">Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
              value={usuarios.password}
              onChange={atualizarEstado}
              className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-slate-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              name="confirmasenha"
              placeholder="Confirmar Senha"
              required
              value={confirmarSenha}
              onChange={handleConfirmarSenha}
              className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium flex justify-center items-center transition"
          >
            {isLoading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              />
            ) : (
              <span>{id || token ? "Atualizar" : "Cadastrar"}</span>
            )}
          </button>

          <p className="text-center text-slate-600 mt-4">
            {id || token ? "Deseja voltar ao perfil?" : "Já tem uma conta?"}{" "}
            <span
              onClick={() => navigate(id || token ? '/perfil' : '/login')}
              className="text-orange-500 hover:underline cursor-pointer"
            >
              {id || token ? "Perfil" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
