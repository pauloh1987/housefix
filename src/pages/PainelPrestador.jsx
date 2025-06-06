import React from "react";
import { useNavigate } from "react-router-dom";

export default function PainelPrestador() {
  const navigate = useNavigate();

  const cards = [
    {
      titulo: "Ver Agendamentos",
      descricao: "Acompanhe os serviços que você recebeu",
      icone: "📅",
      rota: "/meus-agendamentos-prestador",
    },
    {
      titulo: "Responder Chamados",
      descricao: "Aceite solicitações de serviço disponíveis",
      icone: "📨",
      rota: "/chamados-pendentes",
    },
    {
      titulo: "Histórico de Serviços",
      descricao: "Veja os serviços que você já concluiu",
      icone: "✅",
      rota: "/historico-prestador",
    },
    {
      titulo: "Meu Perfil",
      descricao: "Mantenha suas informações atualizadas",
      icone: "👤",
      rota: "/perfil-prestador",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>
          Olá, seja bem-vindo ao <span style={styles.highlight}>HouseFix</span>!
        </h2>
        <p style={styles.subtitle}>Escolha uma das opções abaixo para começar:</p>

        <div style={styles.grid}>
          {cards.map((card, idx) => (
            <div key={idx} style={styles.card} onClick={() => navigate(card.rota)}>
              <div style={styles.icone}>{card.icone}</div>
              <h3 style={styles.cardTitle}>{card.titulo}</h3>
              <p style={styles.cardDesc}>{card.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  content: {
    textAlign: "center",
    padding: "50px 20px",
  },
  title: {
    fontSize: 26,
    color: "#333",
    marginBottom: 10,
  },
  highlight: {
    color: "#0B4DA1",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: "#555",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 30,
  },
  card: {
    backgroundColor: "#fff",
    width: 250,
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  icone: {
    fontSize: 40,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0B4DA1",
  },
  cardDesc: {
    fontSize: 14,
    color: "#555",
  },
};
