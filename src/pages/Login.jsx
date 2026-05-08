import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setStatus("Logging in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Login successful.");
    window.location.href = "/";
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold mb-3">Already logged in</h1>
          <p className="text-slate-600 mb-6">{session.user.email}</p>
          <div className="flex gap-3">
            <a className="rounded-2xl bg-slate-900 px-5 py-3 text-white" href="/">
              Go Dashboard
            </a>
            <button className="rounded-2xl border px-5 py-3" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Knitspeed CRM Login
        </h1>
        <p className="text-slate-600 mb-6">
          Internal access only.
        </p>

        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-white font-medium">
          Login
        </button>

        {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
      </form>
    </div>
  );
}
