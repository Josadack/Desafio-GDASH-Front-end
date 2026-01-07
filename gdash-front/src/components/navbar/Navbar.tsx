import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ToastAlerta } from "../../utils/ToastAlerta";

export default function Navbar() {
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  function logout() {
    handleLogout();
    ToastAlerta('O Usuário foi desconectado com sucesso', 'sucesso');
    navigate('/login');
  }

  return (
    <header className="w-full bg-[#0a0f1f] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={usuario?.token ? "/dashboard" : "/"}>
          <h1 className="text-white text-xl font-semibold cursor-pointer">GDASH</h1>
        </Link>

        <nav className="flex gap-6 text-white/80 text-sm">
          {usuario?.token ? (
            <>
              <Link to="/perfil" className="hover:text-white transition">
                Perfil
              </Link>
              <Link to="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
              <Link to="/insights" className="hover:text-white transition">
                Insights
              </Link>
              <Link to="/explorer" className="hover:text-white transition">
                Explorar
              </Link>
              <button
                onClick={logout}
                className="hover:underline text-white/80"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
              <Link to="/explorer" className="hover:text-white transition">
                Explorar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
