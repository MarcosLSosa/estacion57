"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.replace(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return <main className="auth-page"><div className="auth-panel"><a className="brand" href="/"><span className="brand-mark"><span>EST</span><strong>57!</strong></span> ESTACIÓN 57</a><p className="eyebrow">Acceso privado</p><h1>Panel de gestión.</h1><p>Solo el equipo autorizado puede administrar eventos y validar entradas.</p><form onSubmit={login}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button className="button" type="submit">Ingresar <span>→</span></button>{error && <p className="auth-error">{error}</p>}</form></div></main>;
}

export default function AdminLoginPage() {
  return <Suspense fallback={<main className="auth-page" />}><LoginForm /></Suspense>;
}
