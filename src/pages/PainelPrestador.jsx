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
      if (!user) return;

      const docRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const dados = snap.data();
        setNome(dados.nome || "");
        setEmail(dados.email || "");
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
      if (!user) return;

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
        <h2 style={styles.title}>Perfil</h2>
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
