"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Zap, ShieldAlert, Lock, User, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulated default credentials
    const DEFAULT_USER = "admin@suministroslyd.com";
    const DEFAULT_PASS = "AdminSecurePassword2026!";

    setTimeout(() => {
      if (username.trim() === DEFAULT_USER && password === DEFAULT_PASS) {
        // Write cookie for auth (valid for 1 day)
        document.cookie = "admin_auth=true; path=/; max-age=86400; SameSite=Lax";
        router.push("/admin");
      } else {
        setError("Credenciales incorrectas. Verifique el usuario y la contraseña.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600/20 selection:text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-2xl shadow-2xl z-10 relative">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20">
            <Zap className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-100">
              Acceso Administrativo
            </h1>
            <p className="text-xs text-slate-450 font-mono uppercase tracking-wider">
              Suministros L&D 2023, C.A.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-lg flex gap-2.5 items-start text-xs text-red-400">
              <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              Usuario o Correo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@suministroslyd.com"
                className="w-full bg-slate-955 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-colors rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-955 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-colors rounded-lg py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#007BFF] hover:bg-[#1a8cff] text-slate-900 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-[0.98] shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar a Consola Segura"}
          </button>
        </form>
      </div>
    </main>
  );
}
