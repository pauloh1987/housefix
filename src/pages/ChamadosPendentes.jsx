import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function ChamadosPendentes() {
  const [chamados, setChamados] = useState([]);
  const [especialidade, setEspecialidade] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setErro("Usuário não logado.");
          setCarregando(false);
          return;
        }

        const usuarioSnap = await getDocs(
          query(collection(db, "usuarios"), where("uid", "==", user.uid))
        );

        if (usuarioSnap.empty) {
          setErro("Prestador não encontrado no Firestore.");
          setCarregando(false);
          return;
        }

        const dados = usuarioSnap.docs[0].data();
        if (!dados.especialidade) {
          setErro("Prestador sem especialidade cadastrada.");
          setCarregando(false);
          return;
        }

        setEspecialidade(dados.especialidade);

        const q = query(
          collection(db, "agendamentos"),
          where("especialidade", "==", dados.especialidade),
          where("status", "==", "Pendente"),
          where("prestadorId", "==", null)
        );

        const snap = await getDocs(q);
        const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setChamados(lista);
      } catch (err) {
        setErro("Erro ao buscar chamados: " + err.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchChamados();
  }, []);

  const aceitarChamado = async (id) => {
    try {
      await updateDoc(doc(db, "agendamentos", id), {
        prestadorId: auth.currentUser.uid,
        status: "Aceito",
      });
      setChamados((prev) => prev.filter((c) => c.id !== id));
      alert("Chamado aceito!");
    } catch (err) {
      alert("Erro ao aceitar chamado: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Responder Chamados</h2>
      {carregando ? (
        <p>Carregando chamados...</p>
      ) : erro ? (
        <p style={{ color: "red" }}>{erro}</p>
      ) : chamados.length === 0 ? (
        <p>Nenhum chamado pendente para a especialidade "{especialidade}".</p>
      ) : (
        <div style={styles.lista}>
          {chamados.map((c) => (
            <div key={c.id} style={styles.card}>
              <p><strong>Serviço:</strong> {c.especialidade}</p>
              <p><strong>Data:</strong> {c.data} às {c.hora}</p>
              <p><strong>Descrição:</strong> {c.descricao}</p>
              <button onClick={() => aceitarChamado(c.id)} style={styles.botao}>Aceitar</button>
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
