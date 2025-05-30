import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import mascote from "../assets/mascote.png";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (usuario && senha) {
      // aqui pode adicionar autenticação real futuramente
      navigate("/home");
    } else {
      alert("Preencha todos os campos.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftColumn}>
          <h1 style={styles.title}>HouseFix</h1>
          <p style={styles.subtitle}>Bem-vindo de volta!</p>

          <input
            type="text"
            placeholder="Telefone ou e-mail"
            style={styles.input}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            style={styles.input}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button style={styles.button} onClick={handleLogin}>Entrar</button>

          <p style={styles.link}>
            Não tem uma conta? <Link to="/registrar">Crie uma conta</Link>
          </p>
        </div>

        <div style={styles.rightColumn}>
          <img src={mascote} alt="Mascote HouseFix" style={styles.mascote} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#eaf3fc",
  },
  card: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: 950,
    height: 500,
  },
  leftColumn: {
    flex: 1,
    padding: "50px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightColumn: {
    flex: 1,
    height: "100%",
  },
  mascote: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#E3F2FD",
    padding: "10px"
  },
  title: {
    fontSize: 32,
    color: "#0d47a1",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#333",
  },
  input: {
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#e3f2fd",
  },
  button: {
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0d47a1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    fontSize: 14,
  },
};
