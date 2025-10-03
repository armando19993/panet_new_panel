import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { toast } from "sonner";
import { instance } from "@/utils/instance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (!user || !password) {
      toast.error("Por favor ingrese su usuario y contraseña");
      return;
    }
    setLoading(true);
    instance
      .post("auth/login", {
        user: user.toUpperCase(),
        password,
      })
      .then((result) => {
        const roles = result.data.roles || [];
        const isSuperAdmin = roles.includes("SUPERADMIN");

        if (!isSuperAdmin) {
          toast.error("No tienes permiso para acceder a esta área");
          return;
        }

        // Guardar token y redirigir al usuario
        Cookies.set("token", result.data.token);
        Cookies.set("userId", result.data.data.id);
        Cookies.set("user", result.data.data.user);
        Cookies.set("name", result.data.data.name);
        Cookies.set("sesion", true);
        toast.success("Sesion Iniciada Correcramente");
        navigate("/home"); // Descomenta esta línea para redirigir
      })
      .catch((error) => {
        toast.error("Usuario o contraseña incorrecta");
        setLoading(false);
      });
  };

  const resetPassword = () => {
    if (!user) {
      toast.error(
        "Para poder iniciar el proceso de recuperacion escribe tu nombre de usuario"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F17]">
      <Card className="w-full max-w-md bg-[#1C1F2E] border-gray-800">
        <CardContent className="p-6">
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="ZetPay Logo"
              width={300}
              height={300}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-6">
            Inicia Sesion
          </h1>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Usuario
            </label>
            <Input
              value={user}
              onChange={(event) => setUser(event.target.value)}
              type="text"
              placeholder="Usuario"
              className="w-full bg-[#2C2F3E] border-gray-700 text-white"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Clave
            </label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Clave"
              className="w-full bg-[#2C2F3E] border-gray-700 text-white"
            />
          </div>
          <Button
            disabled={loading}
            onClick={login}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white mt-4"
          >
            {loading && <Loader2 className="animate-spin" />}
            Iniciar Sesion
          </Button>
          {/* <div className="mt-4 text-center">
            <Button
              onClick={resetPassword}
              className="text-sm text-teal-500 hover:underline"
            >
              Olvide Mi Contraseña
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
