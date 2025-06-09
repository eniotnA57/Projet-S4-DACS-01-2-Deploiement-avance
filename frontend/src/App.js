import React, { useEffect, useState } from "react";
import './App.css';
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8000/api";

export default function App() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  // Vérifie s'il y a un token dans localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setToken(storedToken);
      setUsername(decoded.username);
      setRole(decoded.role);
    }
  }, []);

  // Lorsqu'on se connecte ou s'inscrit
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
        localStorage.setItem("token", data.token); // ✅ Sauvegarde token
        const decoded = jwtDecode(data.token);
        setToken(data.token);
        setUsername(decoded.username);
        setRole(decoded.role);
        setMsg(`Connecté en tant que ${decoded.username}`);
      } else {
        setMsg(data.message || data.error);
      }
    } catch (err) {
      setMsg("Erreur serveur.");
    }
  };

  // Redirection conditionnelle selon le rôle
  if (token && role === "user") {
    return <UserDashboard username={username} />;
  }

  if (token && role === "admin") {
    return <AdminDashboard username={username} />;
  }

  // Formulaire si non connecté
  return (
    <>
      <img src="relaax.png" alt="Logo" className="logo" />
      <div className="container">
        <h2>{mode === "register" ? "Inscription" : "Connexion"}</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Pseudo" value={username} onChange={e => setUsername(e.target.value)} /><br />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} /><br />
          {mode === "register" && (
            <>
              <input placeholder="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} /><br />
              <input placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)} /><br />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
            </>
          )}
          <button type="submit">{mode === "register" ? "S'inscrire" : "Se connecter"}</button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Créer un compte" : "Déjà un compte ? Se connecter"}
        </button>
        <div style={{ color: "red" }}>{msg}</div>
      </div>
    </>
  );
}
