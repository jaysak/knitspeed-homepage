import { useAuth } from "./useAuth";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-slate-600">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Dashboard Protected
          </h1>
          <p className="text-slate-600 mb-6">
            Please log in to access Knitspeed CRM.
          </p>
          <a
            href="/login"
            className="inline-block rounded-2xl bg-slate-900 px-5 py-3 text-white font-medium"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return children;
}
