import React, { useState } from "react";
import { useParams } from "react-router-dom";

const mensagensIniciais = [
  { id: 1, de: "cliente", texto: "Olá! Estarei disponível no horário marcado.", hora: "09:00" },
  { id: 2, de: "prestador", texto: "Perfeito! Estarei lá com as ferramentas.", hora: "09:05" },
];

const Chat = () => {
  const { agendamentoId } = useParams();
  const [mensagens, setMensagens] = useState(mensagensIniciais);
  const [texto, setTexto] = useState("");

  const enviarMensagem = () => {
    if (texto.trim() === "") return;

    const novaMsg = {
      id: mensagens.length + 1,
      de: "prestador", // ou "cliente", dependendo de quem estiver logado
      texto,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMensagens([...mensagens, novaMsg]);
    setTexto("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Chat do Agendamento #{agendamentoId}</h2>

        <div style={styles.chatBox}>
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.mensagem,
                alignSelf: msg.de === "cliente" ? "flex-start" : "flex-end",
                backgroundColor: msg.de === "cliente" ? "#e0edff" : "#dcfce7",
              }}
            >
              <p style={styles.texto}>{msg.texto}</p>
              <span style={styles.hora}>{msg.hora}</span>
            </div>
          ))}
        </div>

        <div style={styles.inputBox}>
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite sua mensagem..."
            style={styles.input}
          />
          <button onClick={enviarMensagem} style={styles.botao}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 16,
    textAlign: "center",
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
    borderRadius: 12,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
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
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Chat;
