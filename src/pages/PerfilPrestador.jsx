import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
  getDoc,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

export default function PerfilPrestador() {
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [historico, setHistorico] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const dados = snap.data();
        setNome(dados.nome);
        setFoto(dados.foto || "");
        setPreview(dados.foto || "");
      }

      const q = query(
        collection(db, "agendamentos"),
        where("prestadorId", "==", user.uid),
        where("status", "==", "concluido")
      );
      const querySnap = await getDocs(q);
      const historicoData = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistorico(historicoData);

      const feedbacksFiltrados = historicoData.filter(h => h.feedbackCliente || h.avaliacaoCliente);
      setFeedbacks(feedbacksFiltrados);

      const somatorio = feedbacksFiltrados.reduce((acc, f) => acc + (f.avaliacaoCliente || 0), 0);
      const media = feedbacksFiltrados.length > 0 ? (somatorio / feedbacksFiltrados.length).toFixed(1) : 0;
      setMediaAvaliacao(media);
    };

    fetchData();
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const salvar = async () => {
    const user = auth.currentUser;
    const docRef = doc(db, "usuarios", user.uid);

    let urlFoto = foto;
    if (fotoFile) {
      const storageRef = ref(storage, `fotos/${user.uid}`);
      const uploadTask = await uploadBytesResumable(storageRef, fotoFile);
      urlFoto = await getDownloadURL(uploadTask.ref);
    }

    await updateDoc(docRef, {
      nome,
      foto: urlFoto,
    });

    setFoto(urlFoto);
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Perfil do Prestador</h2>
        <div style={styles.avatarWrapper}>
          {preview ? (
            <img src={preview} alt="Foto" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}></div>
          )}
          <label style={styles.upload}>
            Selecionar Foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
        </div>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          style={styles.input}
        />

        <div style={styles.rating}>
          <p style={{ fontWeight: "bold", marginBottom: 6 }}>Média de Avaliação: {mediaAvaliacao} / 5</p>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < Math.round(mediaAvaliacao) ? "#FFD700" : "#ccc", fontSize: 24 }}>
              ★
            </span>
          ))}
          <p style={{ fontSize: 14, color: "#666", marginTop: 8 }}>Total de serviços concluídos: {historico.length}</p>
        </div>

        <button onClick={salvar} style={styles.button}>
          Salvar Alterações
        </button>

        <h3 style={{ marginTop: 40 }}>⭐ Feedbacks dos Clientes</h3>
        {feedbacks.length === 0 ? (
          <p style={{ color: "#777" }}>Nenhum feedback recebido ainda.</p>
        ) : (
          <ul style={{ textAlign: "left", marginTop: 10 }}>
            {feedbacks.map((f, i) => (
              <li key={i} style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: f.avaliacaoCliente >= star ? "#FFD700" : "#ccc" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#333" }}>{f.feedbackCliente || "Sem comentário."}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    color: "#0B4DA1",
    marginBottom: 20,
  },
  avatarWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #0B4DA1",
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    border: "3px dashed #ccc",
    marginBottom: 10,
  },
  upload: {
    backgroundColor: "#e0edff",
    color: "#0B4DA1",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  rating: {
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0B4DA1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
