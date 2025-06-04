import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AgendarServico() {
  const [especialidade, setEspecialidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [endereco, setEndereco] = useState("");
  const [contatoPreferido, setContatoPreferido] = useState("WhatsApp");
  const [imagem, setImagem] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (file) setImagem(URL.createObjectURL(file));
  };

  const handleAgendar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const clienteId = auth.currentUser.uid;

      await addDoc(collection(db, "agendamentos"), {
        clienteId,
        especialidade,
        descricao,
        data,
        hora,
        endereco,
        contatoPreferido,
        status: "Pendente",
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/agendamentos");
      }, 2500);
    } catch (err) {
      alert("Erro ao agendar serviço: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={styles.container}>
      {showSuccess && (
        <div style={styles.overlay}>
          <div style={styles.successBox}>
            <p style={styles.successTitle}>✅ Agendamento Enviado!</p>
            <p>Você será notificado quando for confirmado.</p>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.title}>📅 Solicitar Serviço</h2>
        <form onSubmit={handleAgendar} style={styles.form}>
          <label style={styles.label}>Especialidade</label>
          <select
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Escolha a especialidade</option>
            <option>Elétrica</option>
            <option>Hidráulica</option>
            <option>Ar Condicionado</option>
            <option>Pintura</option>
            <option>Jardinagem</option>
            <option>Marcenaria</option>
          </select>

          <label style={styles.label}>Descrição do Serviço</label>
          <textarea
            placeholder="Descreva o problema ou serviço desejado"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={4}
            style={{ ...styles.input, resize: "none" }}
          />

          <div style={styles.flexRow}>
            <div style={styles.flexItem}>
              <label style={styles.label}>Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
                style={styles.input}
              />
            </div>
            <div style={styles.flexItem}>
              <label style={styles.label}>Hora</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <label style={styles.label}>Endereço</label>
          <input
            type="text"
            placeholder="Endereço do serviço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Contato Preferido</label>
          <select
            value={contatoPreferido}
            onChange={(e) => setContatoPreferido(e.target.value)}
            style={styles.input}
          >
            <option>WhatsApp</option>
            <option>Ligação</option>
            <option>Ambos</option>
          </select>

          <label style={styles.label}>Imagem (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagem}
            style={styles.input}
          />
          {imagem && <img src={imagem} alt="preview" style={styles.preview} />}

          <button type="submit" style={styles.button} disabled={enviando}>
            {enviando ? "Enviando..." : "Solicitar Agendamento"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#eef3f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    position: "relative",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    animation: "fadeIn 0.4s ease",
  },
  successBox: {
    backgroundColor: "#fff",
    padding: "30px 40px",
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    animation: "zoomIn 0.3s ease",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    maxWidth: 600,
    width: "100%",
    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "#f9fbfe",
    transition: "border 0.3s",
  },
  button: {
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0B4DA1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 10,
  },
  preview: {
    width: 100,
    height: 100,
    objectFit: "cover",
    marginTop: 10,
    borderRadius: 8,
    border: "2px solid #0B4DA1",
  },
  flexRow: {
    display: "flex",
    gap: 12,
  },
  flexItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  '@keyframes zoomIn': {
    from: { transform: 'scale(0.8)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
};
