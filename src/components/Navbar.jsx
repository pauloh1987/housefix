// src/components/Navbar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mostrarSeta = location.pathname !== "/home";

  return (
    <nav style={styles.navbar}>
      {mostrarSeta && (
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Voltar
        </button>
      )}
      <h1 style={styles.logo}>HouseFix</h1>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    padding: "10px 24px",
    backgroundColor: "#0B4DA1",
    color: "#fff",
  },
  backButton: {
    marginRight: 20,
    background: "none",
    color: "#fff",
    fontSize: 16,
    border: "none",
    cursor: "pointer",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
};
