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
  const [avaliacao, setAvaliacao] = useState(0);
  const [historico, setHistorico] = useState([]);

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
        setAvaliacao(dados.avaliacao || 0);
      }

      // Buscar histórico
      const q = query(
        collection(db, "agendamentos"),
        where("prestadorId", "==", user.uid),
        where("status", "==", "concluido")
      );
      const querySnap = await getDocs(q);
      const historicoData = querySnap.docs.map(doc => doc.data());
      setHistorico(historicoData);
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
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < avaliacao ? "#FFD700" : "#ccc", fontSize: 24 }}>
              ★
            </span>
          ))}
        </div>

        <button onClick={salvar} style={styles.button}>
          Salvar Alterações
        </button>

        <h3 style={{ marginTop: 40 }}>Serviços Realizados</h3>
        {historico.length === 0 ? (
          <p style={{ color: "#777" }}>Nenhum serviço concluído ainda.</p>
        ) : (
          <ul>
            {historico.map((h, idx) => (
              <li key={idx} style={{ marginTop: 8 }}>
                {h.tipoServico} - {h.data}
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
