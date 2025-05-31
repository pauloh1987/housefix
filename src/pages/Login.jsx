import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import mascote from "../assets/mascote.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "usuarios", uid));
      if (userDoc.exists()) {
        const dados = userDoc.data();
        if (dados.tipo === "prestador") {
          navigate("/painel-prestador");
        } else {
          navigate("/home");
        }
      } else {
        alert("Usuário não encontrado no Firestore.");
      }
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftColumn}>
          <h1 style={styles.title}>HouseFix</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Entrar</button>
          </form>
          <p style={styles.link}>
            Não tem uma conta? <Link to="/escolher-cadastro">Cadastre-se</Link>
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
    minHeight: 580,
  },
  leftColumn: {
    flex: 1,
    padding: "40px 35px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD",
    padding: "20px",
  },
  mascote: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
  },
  title: {
    fontSize: 32,
    color: "#0d47a1",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#f1f8ff",
  },
  button: {
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0d47a1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  link: {
    marginTop: 15,
    fontSize: 14,
  },
};
