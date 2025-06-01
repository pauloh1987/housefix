import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable
} from "firebase/storage";

export default function PerfilCliente() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      const user = auth.currentUser;
      const docRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const dados = snap.data();
        setNome(dados.nome);
        setEmail(dados.email);
        setTelefone(dados.telefone || "");
        setFoto(dados.foto || "");
        setPreview(dados.foto || "");
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

  const salvar = async () => {
    try {
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
        telefone,
        foto: urlFoto,
      });

      setFoto(urlFoto);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar perfil: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Meu Perfil</h2>
        <div style={styles.avatarWrapper}>
          {preview && <img src={preview} alt="Foto" style={styles.avatar} />}
          <label style={styles.upload}>
            Selecionar Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          style={styles.input}
        />
        <input
          type="email"
          value={email}
          disabled
          style={styles.inputDisabled}
        />
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="Telefone"
          style={styles.input}
        />
        <button onClick={salvar} style={styles.button}>Salvar Alterações</button>
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
    borderRadius: 12,
    padding: 30,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0B4DA1",
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
    objectFit: "cover",
    borderRadius: "50%",
    marginBottom: 10,
    border: "3px solid #0B4DA1",
  },
  upload: {
    padding: "8px 16px",
    backgroundColor: "#e0edff",
    color: "#0B4DA1",
    fontWeight: "bold",
    borderRadius: 6,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 12,
  },
  inputDisabled: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0B4DA1",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
