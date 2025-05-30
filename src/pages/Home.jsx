import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <header style={styles.header}>
        <h1 style={styles.logo}>HouseFix</h1>
        <nav style={styles.navbar}>
          <Link to="/" style={styles.navItem}>Início</Link>
        </nav>
      </header>

      {/* Conteúdo central */}
      <main style={styles.main}>
        <h2 style={styles.welcome}>Olá, seja bem-vindo ao <span style={{ color: "#0B4DA1" }}>HouseFix</span>!</h2>
        <p style={styles.subtext}>Escolha uma das opções abaixo para começar:</p>

        <div style={styles.grid}>
          <Card to="/agendamentos" emoji="📅" label="Ver Agendamentos" />
          <Card to="/agendar" emoji="🛠️" label="Agendar Novo Serviço" />
          <Card to="/perfil" emoji="👤" label="Meu Perfil" />
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
  header: {
    backgroundColor: "#0B4DA1",
    padding: "14px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: 26,
    fontWeight: "bold",
  },
  navbar: {
    display: "flex",
    gap: 20,
  },
  navItem: {
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: "500",
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
