import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function PainelPrestador() {
  const navigate = useNavigate();

  const sair = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Painel do Prestador</h1>

      <div style={styles.botoes}>
        <button onClick={() => navigate("/perfil")} style={styles.botao}>
          Perfil
        </button>
        <button onClick={() => navigate("/chamados-pendentes")} style={styles.botao}>
          Responder Chamados
        </button>
        <button onClick={() => navigate("/meus-agendamentos-prestador")} style={styles.botao}>
          Meus Agendamentos
        </button>
        <button onClick={() => navigate("/agendamentos")} style={styles.botao}>
          Todos Agendamentos
        </button>
        <button onClick={() => navigate("/avaliacoes")} style={styles.botao}>
          Avaliações
        </button>
        <button onClick={sair} style={{ ...styles.botao, backgroundColor: "#ccc" }}>
          Sair
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    minHeight: "100vh",
    backgroundColor: "#eaf3fc",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "#0d47a1",
  },
  botoes: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  botao: {
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0d47a1",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
