import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

export default function ChamadosPendentes() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const fetchChamados = async () => {
      const q = query(
        collection(db, "agendamentos"),
        where("status", "==", "Pendente"),
        where("especialidade", "==", auth.currentUser?.especialidade || "")
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

      setChamados(lista);
    };

    fetchChamados();
  }, []);

  const aceitarChamado = async (chamado) => {
    try {
      const docRef = doc(db, "agendamentos", chamado.id);
      await updateDoc(docRef, {
        status: "Aceito",
        prestadorId: auth.currentUser.uid,
      });

      // Buscar dados do cliente
      const clienteRef = doc(db, "usuarios", chamado.clienteId);
      const clienteSnap = await getDoc(clienteRef);

      if (clienteSnap.exists()) {
        const cliente = clienteSnap.data();
        if (cliente.email) {
          alert(`✅ Chamado aceito! O cliente ${cliente.nome} será notificado por e-mail: ${cliente.email}`);
        } else {
          alert("✅ Chamado aceito! Cliente notificado.");
        }
      }

      // Atualizar lista de chamados
      setChamados((prev) => prev.filter((c) => c.id !== chamado.id));
    } catch (error) {
      alert("Erro ao aceitar chamado: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chamados Pendentes</h2>
      {chamados.length === 0 ? (
        <p>Nenhum chamado pendente.</p>
      ) : (
        <div style={styles.lista}>
          {chamados.map((chamado) => (
            <div key={chamado.id} style={styles.card}>
              <p><strong>Cliente:</strong> {chamado.cliente?.nome || "Desconhecido"}</p>
              <p><strong>Serviço:</strong> {chamado.especialidade}</p>
              <p><strong>Descrição:</strong> {chamado.descricao}</p>
              <p><strong>Data:</strong> {chamado.data} às {chamado.hora}</p>
              <button onClick={() => aceitarChamado(chamado)} style={styles.botao}>
                Aceitar Chamado
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
