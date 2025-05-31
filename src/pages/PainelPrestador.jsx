import React, { useState } from "react";

const agendamentosIniciais = [
  { id: 1, servico: "Instalação de Ar", data: "2025-06-01", horario: "14:00", status: "Pendente" },
  { id: 2, servico: "Reparo Elétrico", data: "2025-06-03", horario: "10:30", status: "Pendente" },
];

const PainelPrestador = () => {
  const [agendamentos, setAgendamentos] = useState(agendamentosIniciais);

  const marcarComoConcluido = (id) => {
    const atualizados = agendamentos.map((item) =>
      item.id === id ? { ...item, status: "Concluído" } : item
    );
    setAgendamentos(atualizados);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Agendamentos Recebidos</h2>
        <p style={styles.subtitle}>Gerencie seus atendimentos abaixo.</p>

        <div style={styles.list}>
          {agendamentos.map((item) => (
            <div key={item.id} style={styles.item}>
              <div>
                <p style={styles.servico}>{item.servico}</p>
                <p style={styles.detalhes}>📅 {item.data} às ⏰ {item.horario}</p>
              </div>
              <div style={styles.acoes}>
                <span
                  style={{
                    ...styles.status,
                    backgroundColor:
                      item.status === "Concluído" ? "#dcfce7" : "#e0edff",
                    color:
                      item.status === "Concluído" ? "#15803d" : "#2563eb",
                  }}
                >
                  {item.status}
                </span>
                {item.status !== "Concluído" && (
                  <button
                    onClick={() => marcarComoConcluido(item.id)}
                    style={styles.botao}
                  >
                    Marcar como Concluído
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    maxWidth: 700,
    width: "100%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0B0F28",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  item: {
    backgroundColor: "#f9fafb",
    padding: "16px 20px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servico: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 6,
  },
  detalhes: {
    fontSize: 14,
    color: "#444",
  },
  acoes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },
  status: {
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "600",
  },
  botao: {
    marginTop: 4,
    backgroundColor: "#0B4DA1",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  },
};

export default PainelPrestador;
