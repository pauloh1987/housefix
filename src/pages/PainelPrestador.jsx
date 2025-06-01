import React from "react";
import { Link } from "react-router-dom";

export default function PainelPrestador() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bem-vindo, Prestador!</h2>
      <p style={styles.subtitle}>Este é o seu painel de controle.</p>

      <div style={styles.grid}>
        <Link to="/agendamentos" style={styles.card}>
          <span role="img" aria-label="calendar">🗓️</span>
          <h3>Ver Agendamentos</h3>
          <p>Acompanhe os serviços que você recebeu</p>
        </Link>

        <Link to="/chat/1" style={styles.card}>
          <span role="img" aria-label="chat">💬</span>
          <h3>Mensagens</h3>
          <p>Converse com seus clientes sobre os serviços</p>
        </Link>

        <Link to="/perfil" style={styles.card}>
          <span role="img" aria-label="tools">🛠️</span>
          <h3>Atualizar Perfil</h3>
          <p>Mantenha suas informações sempre atualizadas</p>
        </Link>

        <Link to="/chamados-pendentes" style={styles.card}>
          <span role="img" aria-label="bell">🔔</span>
          <h3>Responder Chamados</h3>
          <p>Visualize e aceite novos serviços</p>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    color: "#0B4DA1",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    width: 240,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
    textDecoration: "none",
    color: "#000",
  },
};
