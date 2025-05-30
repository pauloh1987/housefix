import React, { useState } from "react";

const Agendar = () => {
  const [formData, setFormData] = useState({
    servico: "",
    data: "",
    horario: "",
    observacao: "",
  });

  const [modalAberto, setModalAberto] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalAberto(true); // Abre o modal
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Agendar Novo Serviço</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Tipo de Serviço</label>
        <select name="servico" value={formData.servico} onChange={handleChange} required style={styles.input}>
          <option value="">Selecione...</option>
          <option value="Ar-Condicionado">Ar-Condicionado</option>
          <option value="Elétrica">Elétrica</option>
          <option value="Hidráulica">Hidráulica</option>
          <option value="Pintura">Pintura</option>
        </select>

        <label style={styles.label}>Data</label>
        <input type="date" name="data" value={formData.data} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Horário</label>
        <input type="time" name="horario" value={formData.horario} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Observação (opcional)</label>
        <textarea
          name="observacao"
          value={formData.observacao}
          onChange={handleChange}
          rows={4}
          placeholder="Ex: Levar escada, verificar vazamento..."
          style={{ ...styles.input, resize: "none" }}
        />

        <button type="submit" style={styles.button}>Solicitar Agendamento</button>
      </form>

      {modalAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={{ fontSize: 18, marginBottom: 20 }}>
              ✅ Você receberá uma notificação quando seu agendamento for confirmado.
            </p>
            <button onClick={fecharModal} style={styles.button}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    padding: "40px 20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#0B4DA1",
    color: "#fff",
    padding: "12px",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    textAlign: "center",
    maxWidth: "400px",
  },
};

export default Agendar;
