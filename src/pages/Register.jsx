import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import mascote from "../assets/mascote.png";

export default function Register() {
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem("tipoCadastro") || "cliente");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const tipo = localStorage.getItem("tipoCadastro");
    if (!tipo) navigate("/escolher-cadastro");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const novoUsuario = {
      nome,
      email,
      telefone,
      nascimento,
      senha,
      tipo: tipoUsuario,
      ...(tipoUsuario === "prestador" && { cpfCnpj, especialidade }),
    };

    localStorage.setItem("usuario", JSON.stringify(novoUsuario));
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.leftColumn}>
          <h1 style={styles.title}>HouseFix</h1>
          <p style={styles.subtitle}>Crie sua conta gratuita</p>

          <div style={styles.selector}>
            <button
              style={{
                ...styles.selectorButton,
                backgroundColor: tipoUsuario === "cliente" ? "#0d47a1" : "#ccc",
                color: tipoUsuario === "cliente" ? "#fff" : "#000",
              }}
              onClick={() => setTipoUsuario("cliente")}
            >
              Cliente
            </button>
            <button
              style={{
                ...styles.selectorButton,
                backgroundColor: tipoUsuario === "prestador" ? "#0d47a1" : "#ccc",
                color: tipoUsuario === "prestador" ? "#fff" : "#000",
              }}
              onClick={() => setTipoUsuario("prestador")}
            >
              Prestador
            </button>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="date"
              placeholder="Data de nascimento"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              style={styles.input}
              required
            />

            {tipoUsuario === "prestador" && (
              <>
                <input
                  type="text"
                  placeholder="CPF ou CNPJ"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  style={styles.input}
                  required
                />
                <select
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  style={styles.input}
                  required
                >
                  <option value="">Especialidade</option>
                  <option>Elétrica</option>
                  <option>Hidráulica</option>
                  <option>Ar Condicionado</option>
                  <option>Pintura</option>
                  <option>Jardinagem</option>
                  <option>Marcenaria</option>
                </select>
              </>
            )}

            <button type="submit" style={styles.button}>Registrar</button>
          </form>

          <p style={styles.link}>
            Já tem uma conta? <Link to="/login">Entrar</Link>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  selector: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },
  selectorButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
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
    backgroundColor: "#f1f8ff",
  },
  button: {
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0d47a1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    marginTop: 10,
    cursor: "pointer",
  },
  link: {
    marginTop: 15,
    fontSize: 14,
  },
};
