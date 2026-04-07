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

  const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");

async function sendMessage() {
  if (!input) return;

  const newMessages = [...messages, { role: "user", content: input }];
  setMessages(newMessages);
  setInput("");

  const res = await fetch("https://YOUR-BACKEND-URL/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: newMessages }),
  });

  const data = await res.json();

  setMessages([...newMessages, data]);
}

return (
  <div style={{ padding: 20, color: "white", background: "black", minHeight: "100vh" }}>
    <h1>Welcome, {user.email}</h1>

    <div style={{ marginTop: 20 }}>
      {messages.map((m, i) => (
        <div key={i}>
          <b>{m.role}:</b> {m.content}
        </div>
      ))}
    </div>

    <div style={{ marginTop: 20 }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
        style={{ padding: 10, width: "70%", color: "black" }}
      />

      <button onClick={sendMessage} style={{ marginLeft: 10 }}>
        Send
      </button>
    </div>

    <button onClick={() => supabase.auth.signOut()} style={{ marginTop: 20 }}>
      Logout
    </button>
  </div>
);