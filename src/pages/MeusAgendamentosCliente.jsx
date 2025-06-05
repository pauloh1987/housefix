import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MeusAgendamentosCliente() {
  const [agendamentos, setAgendamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "agendamentos"),
        where("clienteId", "==", auth.currentUser.uid),
        where("status", "in", ["Pendente", "Aceito"])
      );
      const snap = await getDocs(q);
      const lista = [];

      for (const docAg of snap.docs) {
        const dados = docAg.data();

        // Verifica se tem notificação ativa
        if (dados.notificarCliente && dados.status === "Aceito") {
          dados.avisoNovo = true;
        }

        let prestador = null;
        if (dados.prestadorId) {
          const prestadorSnap = await getDocs(
            query(collection(db, "usuarios"), where("uid", "==", dados.prestadorId))
          );
          prestador = !prestadorSnap.empty ? prestadorSnap.docs[0].data() : null;
        }

        lista.push({ id: docAg.id, ...dados, prestador });
      }

      setAgendamentos(lista);
    };

    fetch();
  }, []);

  const formatarDataHora = (data, hora) => {
    try {
      const d = new Date(`${data}T${hora}`);
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) + ` às ${hora}`;
    } catch {
      return `${data} às ${hora}`;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Meus Agendamentos</h2>
      {agendamentos.length === 0 ? (
        <p style={styles.empty}>Nenhum agendamento encontrado.</p>
      ) : (
        <div style={styles.lista}>
          {agendamentos.map((a) => (
            <div key={a.id} style={styles.card}>
              {a.avisoNovo && (
                <p style={{ color: "green", fontWeight: "bold", marginBottom: 10 }}>
                  ✅ Seu chamado foi aceito!
                </p>
              )}

              <div style={styles.infoBox}>
                <p style={styles.label}>Serviço</p>
                <p style={styles.valor}>{a.especialidade}</p>
              </div>
              <div style={styles.infoBox}>
                <p style={styles.label}>Descrição</p>
                <p style={styles.valor}>{a.descricao}</p>
              </div>
              <div style={styles.infoBox}>
                <p style={styles.label}>Data e Hora</p>
                <p style={styles.valor}>{formatarDataHora(a.data, a.hora)}</p>
              </div>
              <div style={styles.statusBox(a.status)}>
                Status: {a.status}
              </div>

              {a.status === "Aceito" && a.prestador && (
                <div style={styles.prestadorBox}>
                  <p style={styles.subTitle}>🔧 Prestador Confirmado</p>
                  {a.prestador.foto && (
                    <img src={a.prestador.foto} alt="Foto do prestador" style={styles.foto} />
                  )}
                  <p style={styles.valor}><strong>{a.prestador.nome}</strong></p>
                  <p style={styles.valor}>{a.prestador.email}</p>
                  <button
                    onClick={() => navigate(`/chat/${a.id}`)}
                    style={styles.botaoChat}
                  >
                    Entrar no Chat
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 20,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    fontSize: 15,
    color: "#777",
  },
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxWidth: 700,
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    fontSize: 14,
    lineHeight: 1.4,
  },
  infoBox: {
    padding: "6px 0",
    borderBottom: "1px solid #eee",
  },
  label: {
    fontWeight: "600",
    fontSize: 13,
    color: "#333",
    marginBottom: 2,
  },
  valor: {
    fontSize: 14,
    color: "#111",
    margin: 0,
  },
  statusBox: (status) => ({
    backgroundColor: status === "Pendente" ? "#fff8e1" : "#e8f5e9",
    color: status === "Pendente" ? "#a67c00" : "#2e7d32",
    padding: "6px 10px",
    borderRadius: 6,
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 10,
    display: "inline-block",
  }),
  prestadorBox: {
    marginTop: 14,
    textAlign: "center",
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
    color: "#0B4DA1",
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 6,
    border: "1px solid #ccc",
  },
  botaoChat: {
    marginTop: 8,
    backgroundColor: "#0B4DA1",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: "bold",
  },
};
