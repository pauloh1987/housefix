import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AgendarChamado() {
  const [especialidade, setEspecialidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const navigate = useNavigate();

  const solicitarAgendamento = async () => {
    try {
      if (!especialidade || !descricao || !data || !hora) {
        return Swal.fire({
          icon: "warning",
          title: "Campos obrigatórios",
          text: "Preencha todos os campos antes de enviar.",
        });
      }

      const user = auth.currentUser;

      await addDoc(collection(db, "agendamentos"), {
        clienteId: user.uid,
        especialidade: especialidade.toLowerCase(),
        descricao,
        data,
        hora,
        status: "Pendente",
        prestadorId: null,
      });

      const clienteRef = doc(db, "usuarios", user.uid);
      await updateDoc(clienteRef, {
        chamadosFeitos: increment(1)
      });

      Swal.fire({
        title: "Chamado enviado!",
        text: "Prestadores serão notificados.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });

      navigate("/agendamentos");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao solicitar",
        text: error.message,
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Solicitar Serviço</h2>

        <select
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          style={styles.input}
        >
          <option value="">Selecione a especialidade</option>
          <option>Elétrica</option>
          <option>Hidráulica</option>
          <option>Ar Condicionado</option>
          <option>Pintura</option>
          <option>Jardinagem</option>
          <option>Marcenaria</option>
        </select>

        <textarea
          placeholder="Descreva o serviço"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={styles.textarea}
        />

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          style={styles.input}
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          style={styles.input}
        />

        <button onClick={solicitarAgendamento} style={styles.button}>
          Solicitar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    maxWidth: 600,
    width: "100%",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  textarea: {
    width: "100%",
    padding: 12,
    minHeight: 80,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 14,
    backgroundColor: "#0d47a1",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 10,
  },
};
