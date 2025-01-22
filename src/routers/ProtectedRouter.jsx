import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const sesion = Cookies.get("sesion");

  if (!sesion) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
