import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  doc,
  getDocs,
  where
} from "firebase/firestore";

export default function Chat() {
  const { agendamentoId } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [contato, setContato] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats", agendamentoId, "mensagens"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMensagens(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [agendamentoId]);

  useEffect(() => {
    const fetchContato = async () => {
      const agendamentoRef = doc(db, "agendamentos", agendamentoId);
      const agendamentoSnap = await getDoc(agendamentoRef);
      const dados = agendamentoSnap.data();
      const outroUid = auth.currentUser.uid === dados.clienteId ? dados.prestadorId : dados.clienteId;

      const userSnap = await getDocs(query(collection(db, "usuarios"), where("uid", "==", outroUid)));
      if (!userSnap.empty) {
        setContato(userSnap.docs[0].data());
      }
    };
    fetchContato();
  }, [agendamentoId]);

  const enviarMensagem = async () => {
    if (!texto.trim()) return;
    await addDoc(collection(db, "chats", agendamentoId, "mensagens"), {
      de: auth.currentUser.uid,
      texto: texto.trim(),
      timestamp: serverTimestamp(),
    });
    setTexto("");
  };

  const formatarHora = (data) => {
    if (!data) return "";
    const d = data.toDate();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {contato && (
          <div style={styles.contatoBox}>
            <img src={contato.foto} alt="Foto" style={styles.fotoContato} />
            <h3 style={styles.nomeContato}>{contato.nome}</h3>
          </div>
        )}

        <div style={styles.chatBox}>
          {mensagens.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.mensagem,
                alignSelf: msg.de === auth.currentUser.uid ? "flex-end" : "flex-start",
                backgroundColor: msg.de === auth.currentUser.uid ? "#dcfce7" : "#e0edff",
                animation: "fadeIn 0.3s ease"
              }}
            >
              <p style={styles.texto}>{msg.texto}</p>
              <span style={styles.hora}>{formatarHora(msg.timestamp)}</span>
            </div>
          ))}
        </div>

        <div style={styles.inputBox}>
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
            placeholder="Digite sua mensagem..."
            style={styles.input}
          />
          <button onClick={enviarMensagem} style={styles.botao}>📨</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxWidth: 600,
    width: "100%",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    animation: "fadeIn 0.3s ease",
  },
  contatoBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    borderBottom: "1px solid #eee",
    paddingBottom: 12,
  },
  fotoContato: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
  },
  nomeContato: {
    fontSize: 18,
    color: "#0B4DA1",
    fontWeight: "bold"
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "10px 0",
  },
  mensagem: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: 16,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease"
  },
  texto: {
    margin: 0,
    fontSize: 15,
    color: "#333",
  },
  hora: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    display: "block",
  },
  inputBox: {
    display: "flex",
    marginTop: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
  },
  botao: {
    backgroundColor: "#0B4DA1",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "bold",
    cursor: "pointer",
  },
};


