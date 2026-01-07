import { Link, useNavigate } from 'react-router-dom';
import { type ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { RotatingLines } from 'react-loader-spinner';
import type UserLogin from '../../model/UserLogin';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Login() {
  const navigate = useNavigate();

  const [usuarioLogin, setUsuarioLogin] = useState<UserLogin>({
    id: 0,
    name: "",
    email: "",
    password: "",
    token: ""
  });

  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  /* ================== DIA / NOITE ================== */
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;

  const DAY_ICON =
    "https://lottie.host/7739d001-14ba-43a1-8cce-30fa56980163/3Et0qdBaAC.lottie";

  const NIGHT_ICON =
    "https://lottie.host/9a0c1a3f-0c2c-4b78-bca3-37f6932df40f/07bnoxVbTU.lottie";

  /* ================== FUNÇÕES ================== */
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (usuario?.token) {
      navigate('/dashboard');
    }
  }, [usuario, navigate]);

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleLogin(usuarioLogin);
  }


  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ================== LADO ESQUERDO ================== */}
      <div
        className={`lg:w-1/2 flex items-center justify-center relative transition-colors duration-500
          ${isDay ? "bg-slate-950 text-white" : "bg-slate-900 text-white"}
        `}
      >
        {/* BLOCO CENTRAL (ÍCONE + TEXTO) */}
        <div className="flex flex-col items-center text-center space-y-6">
          {/* ÍCONE DIA / NOITE (ACIMA DO HELLO) */}
          <div className="w-24 h-24">
            <DotLottieReact
              src={isDay ? DAY_ICON : NIGHT_ICON}
              loop
              autoplay
            />
          </div>

          {/* TEXTO */}
          <h1
            className={`text-4xl font-bold ${isDay ? "text-orange-900" : "text-indigo-400"
              }`}
          >
            Hello!
          </h1>

          <p
            className={`text-xl mb-2 ${isDay ? "text-slate-300" : "text-slate-300"
              }`}
          >
            Have a{" "}
            <span className="font-bold">
              {isDay ? "GOOD DAY" : "GOOD NIGHT"}
            </span>
          </p>
        </div>

        {/* ELEMENTOS DECORATIVOS */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-2 border-orange-500 opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-orange-400 opacity-10"></div>
      </div>

      {/* ================== LADO DIREITO ================== */}
      <div className="lg:w-1/2 flex items-center justify-center bg-white p-10">
        <form
          onSubmit={login}
          className="w-full max-w-md flex flex-col gap-6 p-8 rounded-2xl shadow-lg bg-white"
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Login
          </h2>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-slate-700 mb-1">
              Usuário
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Digite seu usuário"
              value={usuarioLogin.email}
              onChange={atualizarEstado}
              className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-slate-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Digite sua senha"
              value={usuarioLogin.password}
              onChange={atualizarEstado}
              className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium flex justify-center items-center transition"
          >
            {isLoading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="4"
                animationDuration="0.75"
                width="24"
                visible
              />
            ) : (
              "Entrar"
            )}
          </button>
          <Link
            to="/"
            className="text-center text-xs text-slate-400 hover:text-slate-600 transition"
          >
            Continuar sem login
          </Link>

          <p className="text-center text-slate-600 mt-4">
            Ainda não tem uma conta?{" "}
            <Link to="/register" className="text-orange-500 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
