import React, { useState } from "react";

const API_URL = "http://localhost:8000/api";

export default function App() {
  const [mode, setMode] = useState("login"); // "login" ou "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  const endpoint = mode === "register" ? "register" : "login";
  const body = mode === "register"
    ? { username, password, firstName, lastName, email }
    : { username, password };

  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setMsg(`Connecté en tant que ${username}`);
    } else {
      setMsg(data.message || data.error);
    }
  } catch (err) {
    setMsg("Erreur serveur.");
  }
};


  if (token) {
    return <div>Bienvenue, {username} ! (token : {token.slice(0, 12)}...)</div>;
  }

  return (
  <div style={{ padding: 40 }}>
    <h2>{mode === "register" ? "Inscription" : "Connexion"}</h2>
    <form onSubmit={handleSubmit}>
      <input placeholder="Pseudo" value={username} onChange={e => setUsername(e.target.value)} /><br/>
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      {mode === "register" && (
        <>
          <input placeholder="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} /><br/>
          <input placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)} /><br/>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
        </>
      )}
      <button type="submit">{mode === "register" ? "S'inscrire" : "Se connecter"}</button>
    </form>
    <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{marginTop: 10}}>
      {mode === "login" ? "Créer un compte" : "Déjà un compte ? Se connecter"}
    </button>
    <div style={{color: "red"}}>{msg}</div>
  </div>
);

}
