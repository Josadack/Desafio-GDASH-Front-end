import { createContext, useState, type ReactNode } from "react";
import type UserLogin from "../model/UserLogin";
import { ToastAlerta } from "../utils/ToastAlerta";
import { login } from "../services/Api";
import type { LoginDTO } from "../model/LoginDTOS";

// Interfaces do contexto e do provider
interface AuthContextProps {
 usuario: UserLogin;
  handleLogout(): void;
  handleLogin(credentials: LoginDTO): Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Criação do contexto
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

// Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UserLogin>(() => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser
      ? JSON.parse(storedUser) as UserLogin
      : { id: 0, name: "", email: "", password: "", token: "" };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleLogin(credentials: LoginDTO) {
    setIsLoading(true);

    try {
      const userLogged = await login("/api/auth/login", credentials, setUsuario);

      if (!userLogged || !userLogged.token) {
        throw new Error("Login falhou: token não retornado");
      }

      setUsuario(userLogged);
      localStorage.setItem("usuario", JSON.stringify(userLogged));
      ToastAlerta("O Usuário foi autenticado com sucesso", "sucesso");
    } catch (error) {
      ToastAlerta("Os dados do usuário estão inconsistentes!", "erro");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setUsuario({ id: 0, name: "", email: "", password: "", token: "" });
    localStorage.removeItem("usuario");
  }

  return (
    <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
