import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
  getDoc,
  doc
} from "firebase/firestore";

export default function PerfilCliente() {
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState("");
  const [preview, setPreview] = useState("");
  const [mediaNotas, setMediaNotas] = useState(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const buscarDados = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const dados = snap.data();
        setNome(dados.nome || "");
        setFoto(dados.foto || "");
        setPreview(dados.foto || "");

        if (dados.notaTotal && dados.qtdAvaliacoes) {
          const media = dados.qtdAvaliacoes > 0
            ? (dados.notaTotal / dados.qtdAvaliacoes).toFixed(1)
            : null;
          setMediaNotas(media);
        }

        // Exemplo de histórico — substitua com busca real se quiser
        if (dados.historico) {
          setHistorico(dados.historico);
        } else {
          setHistorico([
            "Instalação de ar-condicionado",
            "Troca de tomada",
            "Limpeza de caixa d’água"
          ]);
        }
      }
    };
    buscarDados();
  }, []);

  const renderEstrelas = (media) => {
    const estrelas = [];
    const nota = Math.round(media);
    for (let i = 1; i <= 5; i++) {
      estrelas.push(i <= nota ? "★" : "☆");
    }
    return estrelas.join(" ");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatarWrapper}>
          {preview ? (
            <img src={preview} alt="Foto" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}></div>
          )}
        </div>

        <h2 style={styles.nome}>{nome}</h2>

        {mediaNotas && (
          <p style={styles.estrelas}>
            {renderEstrelas(mediaNotas)} <span style={{ fontSize: 14 }}>({mediaNotas})</span>
          </p>
        )}

        <div style={styles.historicoWrapper}>
          <h3 style={styles.historicoTitulo}>Serviços Realizados</h3>
          <ul style={styles.historicoLista}>
            {historico.map((item, index) => (
              <li key={index} style={styles.historicoItem}>✔ {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  },
  avatarWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #0B4DA1",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    backgroundColor: "#ccc",
    border: "3px solid #0B4DA1",
  },
  nome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0B4DA1",
  },
  estrelas: {
    fontSize: 22,
    color: "#f7c948",
    marginBottom: 20,
  },
  historicoWrapper: {
    textAlign: "left",
    marginTop: 20,
  },
  historicoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  historicoLista: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  historicoItem: {
    fontSize: 15,
    marginBottom: 8,
    color: "#555",
  },
};
