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

  if (!user) return <Auth />;

  return (
    <div style={{ padding: 40 }}>
      <h1>🚀 REAL APP LIVE 🚀</h1>
      <button onClick={() => supabase.auth.signOut()}>
        Logout
      </button>
    </div>
  );
}