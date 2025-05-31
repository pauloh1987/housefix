import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioId(user.uid);
        carregarAgendamentos(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const carregarAgendamentos = async (uid) => {
    const q = query(collection(db, "agendamentos"), where("clienteId", "==", uid));
    const snapshot = await getDocs(q);
    const dados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAgendamentos(dados);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Meus Agendamentos</h2>
        {agendamentos.length === 0 ? (
          <p style={styles.subtitle}>Nenhum agendamento encontrado.</p>
        ) : (
          <div style={styles.list}>
            {agendamentos.map((item) => (
              <div key={item.id} style={styles.item}>
                <div>
                  <p style={styles.servico}>{item.especialidade}</p>
                  <p style={styles.detalhes}>{item.descricao}</p>
                  <p style={styles.detalhes}>📅 {item.data} às ⏰ {item.hora}</p>
                </div>
                <span style={{
                  ...styles.status,
                  backgroundColor: item.status === "Concluído" ? "#dcfce7" : item.status === "Confirmado" ? "#e0f2fe" : "#fffbea",
                  color: item.status === "Concluído" ? "#15803d" : item.status === "Confirmado" ? "#2563eb" : "#b45309",
                }}>{item.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 20,
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
  status: {
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "600",
  },
};
