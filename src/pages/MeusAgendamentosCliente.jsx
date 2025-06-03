import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MeusAgendamentosCliente() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const buscarAgendamentos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "agendamentos"),
        where("clienteId", "==", user.uid),
        where("status", "==", "concluído")
      );

      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAgendamentos(lista);
    };

    buscarAgendamentos();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Histórico de Serviços</h2>
      {agendamentos.length === 0 ? (
        <p style={styles.empty}>Nenhum serviço concluído ainda.</p>
      ) : (
        <ul style={styles.list}>
          {agendamentos.map((agendamento) => (
            <li key={agendamento.id} style={styles.item}>
              <strong>{agendamento.tipoServico}</strong> <br />
              Prestador: {agendamento.nomePrestador || "N/A"} <br />
              Data: {agendamento.data || "N/A"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  title: {
    fontSize: 26,
    color: "#0B4DA1",
    textAlign: "center",
    marginBottom: 30,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
  list: {
    maxWidth: 600,
    margin: "0 auto",
    listStyle: "none",
    padding: 0,
  },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    fontSize: 16,
    color: "#333",
  },
};
