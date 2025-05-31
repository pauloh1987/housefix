import React from "react";
import { useNavigate } from "react-router-dom";

const SelecaoCadastro = () => {
  const navigate = useNavigate();

  const escolherTipo = (tipo) => {
    localStorage.setItem("tipoCadastro", tipo);
    navigate("/cadastro");
  };

  return (
    <div style={styles.container}>
      <h2>Como você quer se cadastrar?</h2>
      <div style={styles.buttons}>
        <button style={styles.button} onClick={() => escolherTipo("cliente")}>Sou Cliente</button>
        <button style={styles.button} onClick={() => escolherTipo("prestador")}>Sou Prestador</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginTop: 30,
  },
  button: {
    backgroundColor: "#0B4DA1",
    color: "#fff",
    padding: "16px 24px",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default SelecaoCadastro;
