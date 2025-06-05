import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
  getDoc,
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PerfilCliente() {
  const [nome, setNome] = useState("Carregando...");
  const [foto, setFoto] = useState("");
  const [preview, setPreview] = useState("");
  const [mediaNotas, setMediaNotas] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [qtdServicos, setQtdServicos] = useState(0);
  const [ultimaData, setUltimaData] = useState("--/--/----");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const buscarDados = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const dados = userSnap.data();
        setNome(dados.nome || "Usuário");
        setFoto(dados.foto || "");
        setPreview(dados.foto || "");
        setCidade(dados.cidade || "");
        setEstado(dados.estado || "");

        if (dados.notaTotal && dados.qtdAvaliacoes > 0) {
          const media = (dados.notaTotal / dados.qtdAvaliacoes).toFixed(1);
          setMediaNotas(media);
        }
      }

      const ordensRef = collection(db, "agendamentos");
      const q2 = query(ordensRef, where("clienteId", "==", user.uid), where("status", "==", "concluido"));
      const snap2 = await getDocs(q2);

      setQtdServicos(snap2.size);

      if (snap2.size > 0) {
        const datas = snap2.docs.map(doc => doc.data().data);
        const ultima = datas.sort().reverse()[0];
        const dataFormatada = new Date(ultima).toLocaleDateString();
        setUltimaData(dataFormatada);
      }
    };

    buscarDados();
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const salvarFoto = async () => {
    const user = auth.currentUser;
    if (!user || !fotoFile) return;

    const storageRef = ref(storage, `fotos/${user.uid}`);
    const uploadTask = await uploadBytesResumable(storageRef, fotoFile);
    const urlFoto = await getDownloadURL(uploadTask.ref);

    await updateDoc(doc(db, "usuarios", user.uid), {
      foto: urlFoto,
    });

    setFoto(urlFoto);
    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: "Foto atualizada com sucesso!",
      confirmButtonText: "OK",
    });
  };

  const renderEstrelas = (media) => {
    const nota = Math.round(media);
    return Array.from({ length: 5 }, (_, i) =>
      i < nota ? "★" : "☆"
    ).join(" ");
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatarBox}>
          {preview ? (
            <img src={preview} style={styles.avatar} alt="foto" />
          ) : (
            <div style={styles.avatarPlaceholder}></div>
          )}
          <label style={styles.upload}>
            Trocar foto
            <input type="file" onChange={handleFotoChange} accept="image/*" style={{ display: "none" }} />
          </label>
          {fotoFile && (
            <button onClick={salvarFoto} style={styles.botaoSalvar}>
              Salvar
            </button>
          )}
        </div>

        <h2 style={styles.nome}>{nome}</h2>

        {mediaNotas && (
          <p style={styles.estrelas}>
            {renderEstrelas(mediaNotas)} <span style={{ fontSize: 14 }}>({mediaNotas})</span>
          </p>
        )}

        <p style={styles.descricao}>Obrigado por usar o HouseFix, {nome.split(" ")[0]}!</p>

        <div style={styles.infoBox}>
          <p><strong>📍 Cidade:</strong> {cidade || "Não informada"}</p>
          <p><strong>🌎 Estado:</strong> {estado || "Não informado"}</p>
          <p><strong>🛠 Serviços contratados:</strong> {qtdServicos}</p>
          <p><strong>📅 Último serviço:</strong> {ultimaData}</p>
        </div>

        <button onClick={handleLogout} style={styles.logout}>🚪 Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#f5f8fb",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  avatarBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #0B4DA1",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    backgroundColor: "#ccc",
    border: "3px solid #0B4DA1",
  },
  upload: {
    marginTop: 10,
    backgroundColor: "#e0edff",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 14,
    cursor: "pointer",
    color: "#0B4DA1",
    fontWeight: "bold",
  },
  botaoSalvar: {
    marginTop: 6,
    backgroundColor: "#0B4DA1",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#0B4DA1",
  },
  estrelas: {
    color: "#f7c948",
    fontSize: 20,
    marginBottom: 12,
  },
  descricao: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#f0f4f8",
    padding: 16,
    borderRadius: 8,
    textAlign: "left",
    marginBottom: 20,
    fontSize: 15,
    color: "#333",
  },
  logout: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    fontSize: 15,
    cursor: "pointer",
  },
};
