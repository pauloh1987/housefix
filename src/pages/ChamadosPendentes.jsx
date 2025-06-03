import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ChamadosPendentes() {
  const [chamados, setChamados] = useState([]);
  const [especialidade, setEspecialidade] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChamados = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const prestadorRef = doc(db, "usuarios", user.uid);
      const prestadorSnap = await getDoc(prestadorRef);

      if (prestadorSnap.exists()) {
        const dados = prestadorSnap.data();
        const esp = dados.especialidade || "";
        setEspecialidade(esp);

        const q = query(
          collection(db, "agendamentos"),
          where("status", "==", "pendente"),
          where("especialidade", "==", esp)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChamados(data);
      }
    };

    fetchChamados();
  }, []);

  const aceitarChamado = async (id) => {
    await updateDoc(doc(db, "agendamentos", id), {
      status: "aceito",
      prestadorId: auth.currentUser.uid
    });
    alert("Chamado aceito!");
    setChamados(chamados.filter(c => c.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>Chamados Pendentes</h2>
      {chamados.length === 0 ? (
        <p>Nenhum chamado pendente compatível com sua especialidade ({especialidade}).</p>
      ) : (
        chamados.map((chamado) => (
          <div key={chamado.id} style={styles.card}>
            <p><strong>Especialidade:</strong> {chamado.especialidade}</p>
            <p><strong>Descrição:</strong> {chamado.descricao}</p>
            <p><strong>Data:</strong> {chamado.data} às {chamado.hora}</p>

            <div style={styles.buttons}>
              <button onClick={() => aceitarChamado(chamado.id)} style={styles.buttonAceitar}>
                Aceitar Chamado
              </button>
              <button onClick={() => navigate(`/perfil-cliente/${chamado.clienteId}`)} style={styles.buttonPerfil}>
                Ver Perfil do Cliente
              </button>
              <button onClick={() => navigate(`/chat/${chamado.id}`)} style={styles.buttonChat}>
                Abrir Chat
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  buttons: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  buttonAceitar: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
  buttonPerfil: {
    backgroundColor: "#0B4DA1",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
  buttonChat: {
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
