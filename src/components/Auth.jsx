import { useState } from "react";
import supabase from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  }

  async function handleSignup() {
  console.log("SIGNUP CLICKED");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) alert(error.message);
  else alert("Check your email to confirm signup");
}

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
      <h1 className="text-2xl mb-6">Login / Sign Up</h1>

      <input
        className="p-2 mb-2 text-black w-64"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="p-2 mb-4 text-black w-64"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-2">
        <button onClick={handleLogin} className="bg-white text-black px-4 py-2">
          Login
        </button>

        <button onClick={handleSignup} className="bg-white text-black px-4 py-2">
          Sign Up
        </button>
      </div>
    </div>
  );
}