import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function HistoricoPrestador() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ id: null, descricao: "", nota: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "agendamentos"),
        where("prestadorId", "==", auth.currentUser.uid),
        where("status", "==", "Concluído")
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

  const renderStars = (nota) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <span key={i} style={{ color: i <= nota ? "#FFD700" : "#ccc" }}>★</span>
      );
    }
    return estrelas;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Histórico de Serviços</h2>
      {agendamentos.length === 0 ? (
        <p>Nenhum serviço concluído encontrado.</p>
      ) : (
        <div style={styles.lista}>
          {agendamentos.map((a) => (
            <div key={a.id} style={styles.card}>
              {a.cliente?.foto && (
                <img
                  src={a.cliente.foto}
                  alt="Foto do cliente"
                  style={styles.fotoCliente}
                />
              )}
              <p><strong>Cliente:</strong> {a.cliente?.nome || "Desconhecido"}</p>
              <p><strong>Serviço:</strong> {a.especialidade}</p>
              <p><strong>Data:</strong> {a.data} às {a.hora}</p>
              <p><strong>Serviços Realizados:</strong> {a.servicoRealizado || "Não informado"}</p>
              <p><strong>Avaliação:</strong> {renderStars(a.avaliacao || 0)}</p>
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
    border: "1px solid #e0e0e0",
  },
  fotoCliente: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 10,
  },
};
