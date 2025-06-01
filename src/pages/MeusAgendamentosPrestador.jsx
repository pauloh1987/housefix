import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MeusAgendamentosPrestador() {
  const [agendamentos, setAgendamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "agendamentos"),
        where("prestadorId", "==", auth.currentUser.uid),
        where("status", "in", ["Aceito", "Concluído"])
      );
      const snap = await getDocs(q);
      const lista = [];

      for (const docAg of snap.docs) {
        const dados = docAg.data();
        const clienteSnap = await getDocs(
          query(collection(db, "usuarios"), where("uid", "==", dados.clienteId))
        );
        const cliente = !clienteSnap.empty ? clienteSnap.docs[0].data() : null;
        lista.push({ id: docAg.id, ...dados, cliente });
      }

      setAgendamentos(lista);
    };

    fetch();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Meus Agendamentos</h2>
      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <div style={styles.lista}>
          {agendamentos.map((a) => (
            <div key={a.id} style={styles.card}>
              <p><strong>Cliente:</strong> {a.cliente?.nome || "Desconhecido"}</p>
              <p><strong>Email:</strong> {a.cliente?.email || "Sem email"}</p>
              <p><strong>Serviço:</strong> {a.especialidade}</p>
              <p><strong>Descrição:</strong> {a.descricao}</p>
              <p><strong>Data:</strong> {a.data} às {a.hora}</p>
              <button
                onClick={() => navigate(`/chat/${a.id}`)}
                style={styles.botao}
              >
                Entrar no Chat
              </button>
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
  },
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  botao: {
    marginTop: 10,
    backgroundColor: "#0B4DA1",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
