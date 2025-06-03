// src/pages/ChamadosPendentes.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ChamadosPendentes() {
  const [chamados, setChamados] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [nota, setNota] = useState(5);
  const [selecionado, setSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarChamados = async () => {
      const snapshot = await getDocs(collection(db, "agendamentos"));
      const pendentes = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((ag) => ag.status === "pendente");
      setChamados(pendentes);
    };
    buscarChamados();
  }, []);

  const concluirChamado = async (id) => {
    if (!feedback || !nota) return alert("Preencha o feedback e a nota.");
    await updateDoc(doc(db, "agendamentos", id), {
      status: "concluido",
      feedbackPrestador: feedback,
      notaPrestador: nota,
    });
    alert("Serviço marcado como concluído com sucesso!");
    setChamados((prev) => prev.filter((c) => c.id !== id));
    setSelecionado(null);
    setFeedback("");
    setNota(5);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Chamados Pendentes</h2>
      {chamados.length === 0 && <p>Nenhum chamado pendente.</p>}

      {chamados.map((c) => (
        <div key={c.id} style={styles.card}>
          <p><strong>Cliente:</strong> {c.nomeCliente}</p>
          <p><strong>Serviço:</strong> {c.tipoServico}</p>
          <button onClick={() => navigate(`/chat/${c.id}`)} style={styles.buttonSec}>Entrar no Chat</button>
          <button onClick={() => setSelecionado(c.id)} style={styles.button}>Marcar como Concluído</button>

          {selecionado === c.id && (
            <div style={{ marginTop: 12 }}>
              <textarea
                placeholder="Escreva um feedback sobre o serviço"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={styles.textarea}
              />
              <select value={nota} onChange={(e) => setNota(Number(e.target.value))} style={styles.select}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} estrela{n > 1 ? "s" : ""}</option>
                ))}
              </select>
              <button onClick={() => concluirChamado(c.id)} style={styles.button}>Confirmar Conclusão</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: 10,
    padding: "10px 16px",
    backgroundColor: "#0B4DA1",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginRight: 10,
  },
  buttonSec: {
    marginTop: 10,
    padding: "10px 16px",
    backgroundColor: "#ddd",
    color: "#333",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginRight: 10,
  },
  textarea: {
    width: "100%",
    height: 80,
    marginTop: 10,
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  select: {
    marginTop: 10,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
    width: "100%",
  },
};
