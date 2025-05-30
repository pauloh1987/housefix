import React, { useState } from "react";

export default function Prestadores() {
  const [form, setForm] = useState({
    nome: "",
    cpfCnpj: "",
    especialidade: "",
    telefone: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Prestador cadastrado com sucesso!");
    setForm({
      nome: "",
      cpfCnpj: "",
      especialidade: "",
      telefone: "",
      email: "",
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cadastro de Prestador de Serviço</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="cpfCnpj"
          placeholder="CPF ou CNPJ"
          value={form.cpfCnpj}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="especialidade"
          placeholder="Especialidade"
          value={form.especialidade}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Salvar
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "50px auto",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#0d47a1",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "#e3f2fd",
  },
  button: {
    padding: 14,
    backgroundColor: "#0d47a1",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
