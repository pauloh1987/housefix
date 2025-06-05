import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h2 style={styles.welcome}>
          Olá, seja bem-vindo ao <span style={{ color: "#0B4DA1" }}>HouseFix</span>!
        </h2>
        <p style={styles.subtext}>Escolha uma das opções abaixo para começar:</p>

        <div style={styles.grid}>
          <Card to="/agendamentos" emoji="📅" label="Ver Agendamentos" />
          <Card to="/agendar" emoji="🛠️" label="Agendar Novo Serviço" />
          <Card to="/historico" emoji="🧾" label="Histórico de Serviços" />
          <Card to="/perfil-cliente" emoji="👤" label="Meu Perfil" />
        </div>
      </main>
    </div>
  );
};

const Card = ({ to, emoji, label }) => (
  <Link to={to} style={styles.card}>
    <span style={styles.emoji}>{emoji}</span>
    <p>{label}</p>
  </Link>
);

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  main: {
    padding: "60px 20px",
    textAlign: "center",
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: "#555",
  },
  grid: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    gap: 30,
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
    textDecoration: "none",
    color: "#0B4DA1",
    fontWeight: "bold",
    width: 220,
    height: 140,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.2s ease",
  },
  emoji: {
    fontSize: 36,
    marginBottom: 10,
  },
};

export default Home;
