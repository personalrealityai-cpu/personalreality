import { useEffect, useState } from "react";
import supabase from "./lib/supabase";
import Auth from "./components/Auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  // 🔐 NOT LOGGED IN → SHOW LOGIN
  if (!user) return <Auth />;

  // ✅ LOGGED IN → SHOW DASHBOARD
  return (
    <div style={{ padding: 40, color: "white", background: "black", minHeight: "100vh" }}>
      <h1>Welcome, {user.email}</h1>

      <p>This is your dashboard.</p>

      <button
        onClick={() => supabase.auth.signOut()}
        style={{ marginTop: 20 }}
      >
        Logout
      </button>
    </div>
  );
}