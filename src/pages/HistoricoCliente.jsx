import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function HistoricoCliente() {
  const [historico, setHistorico] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "agendamentos"),
        where("clienteId", "==", auth.currentUser.uid),
        where("status", "==", "Concluído")
      );
      const snap = await getDocs(q);
      const lista = [];
      for (const docAg of snap.docs) {
        const dados = docAg.data();
        const prestadorSnap = await getDocs(
          query(collection(db, "usuarios"), where("uid", "==", dados.prestadorId))
        );
        const prestador = !prestadorSnap.empty ? prestadorSnap.docs[0].data() : null;
        lista.push({ id: docAg.id, ...dados, prestador });
      }
      setHistorico(lista);
    };
    fetch();
  }, []);

  const handleAvaliacao = async (id, nota) => {
    setAvaliacoes((prev) => ({ ...prev, [id]: nota }));
    await updateDoc(doc(db, "agendamentos", id), { avaliacaoCliente: nota });
    Swal.fire({
      title: "Avaliação enviada!",
      text: "Obrigado pelo seu feedback!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      position: "center",
      toast: false
    });
  };

  const handleFeedbackChange = (id, texto) => {
    setFeedbacks((prev) => ({ ...prev, [id]: texto }));
  };

  const enviarFeedback = async (id) => {
    if (!feedbacks[id] || feedbacks[id].trim() === "") return;
    await updateDoc(doc(db, "agendamentos", id), { feedbackCliente: feedbacks[id] });
    Swal.fire({
      title: "Feedback enviado!",
      text: "Agradecemos pela sua avaliação!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      position: "center",
      toast: false
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Histórico de Serviços</h2>
      {historico.length === 0 ? (
        <p style={styles.empty}>Você ainda não possui serviços finalizados.</p>
      ) : (
        <div style={styles.lista}>
          {historico.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.infoBox}>
                <p style={styles.label}>Serviço:</p>
                <p style={styles.valor}>{item.especialidade}</p>
              </div>
              <div style={styles.infoBox}>
                <p style={styles.label}>O que foi feito:</p>
                <p style={styles.valor}>{item.descricaoConclusao || "Sem descrição."}</p>
              </div>
              {item.prestador && (
                <div style={styles.prestadorBox}>
                  {item.prestador.foto && <img src={item.prestador.foto} alt="Prestador" style={styles.foto} />} 
                  <p style={styles.subTitle}>{item.prestador.nome}</p>
                </div>
              )}
              <div>
                <p style={styles.label}>Avalie o serviço:</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleAvaliacao(item.id, star)}
                    style={{
                      fontSize: 22,
                      cursor: "pointer",
                      color: (avaliacoes[item.id] || item.avaliacaoCliente) >= star ? "#FFD700" : "#ccc",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <textarea
                  rows={3}
                  placeholder="Escreva um feedback para o prestador..."
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                  value={feedbacks[item.id] || ""}
                  onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                />
                <button
                  style={{ marginTop: 8, backgroundColor: "#0B4DA1", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6 }}
                  onClick={() => enviarFeedback(item.id)}
                >
                  Enviar Feedback
                </button>
              </div>
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
};
