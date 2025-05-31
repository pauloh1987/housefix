import React from "react";
import { useNavigate } from "react-router-dom";

export default function PainelPrestador() {
  const nomePrestador = JSON.parse(localStorage.getItem("usuario"))?.nome || "Prestador";
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bem-vindo, {nomePrestador}!</h2>
      <p style={styles.subtitle}>Este é o seu painel de controle.</p>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate("/agendamentos-prestador")}> 
          <span role="img" aria-label="calendar" style={styles.emoji}>📅</span>
          <h3>Ver Agendamentos</h3>
          <p>Acompanhe os serviços que você recebeu</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/chat/1")}> 
          <span role="img" aria-label="chat" style={styles.emoji}>💬</span>
          <h3>Mensagens</h3>
          <p>Converse com seus clientes sobre os serviços</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/perfil")}> 
          <span role="img" aria-label="tools" style={styles.emoji}>🛠️</span>
          <h3>Atualizar Perfil</h3>
          <p>Mantenha suas informações sempre atualizadas</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    textAlign: "center",
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
  },
  title: {
    fontSize: 28,
    color: "#0d47a1",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: 30,
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: 250,
    height: 180,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  emoji: {
    fontSize: 36,
    marginBottom: 10,
  },
};
