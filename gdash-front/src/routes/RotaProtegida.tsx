import { useContext, type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function RotaProtegida({ children }: { children: JSX.Element }) {
  const { usuario } = useContext(AuthContext);
  const location = useLocation();

  if (!usuario?.token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
