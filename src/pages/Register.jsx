import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import mascote from "../assets/mascote.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    nascimento: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !form.nome ||
      !form.email ||
      !form.telefone ||
      !form.nascimento ||
      !form.senha ||
      !form.confirmarSenha
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    // Aqui você pode adicionar o salvamento dos dados

    alert("Conta criada com sucesso!");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftColumn}>
          <h1 style={styles.title}>Crie sua conta</h1>
          <p style={styles.subtitle}>Preencha seus dados para começar a usar o HouseFix.</p>

          <form style={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              style={styles.input}
              value={form.nome}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              style={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="telefone"
              placeholder="Telefone"
              style={styles.input}
              value={form.telefone}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="nascimento"
              placeholder="Data de nascimento"
              style={styles.input}
              value={form.nascimento}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              style={styles.input}
              value={form.senha}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              style={styles.input}
              value={form.confirmarSenha}
              onChange={handleChange}
              required
            />

            <button type="submit" style={styles.button}>Registrar</button>
          </form>

          <p style={styles.link}>
            Já tem uma conta? <Link to="/">Entrar</Link>
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
    height: "auto",
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
    padding: "10px",
  },
  title: {
    fontSize: 28,
    color: "#0d47a1",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 12,
    fontSize: 16,
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
