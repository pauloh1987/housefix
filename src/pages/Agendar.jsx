import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AgendarServico() {
  const [especialidade, setEspecialidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

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
        status: "Pendente",
      });

      alert("Agendamento enviado! Você será notificado quando for confirmado.");
      navigate("/agendamentos");
    } catch (err) {
      alert("Erro ao agendar serviço: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Agendar Serviço</h2>
        <form onSubmit={handleAgendar} style={styles.form}>
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

          <textarea
            placeholder="Descreva o problema ou serviço desejado"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={4}
            style={{ ...styles.input, resize: "none" }}
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
            style={styles.input}
          />

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
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    maxWidth: 500,
    width: "100%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B0F28",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#f1f8ff",
  },
  button: {
    padding: 14,
    fontSize: 16,
    backgroundColor: "#0d47a1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
