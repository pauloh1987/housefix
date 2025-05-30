import React from 'react';
import { Link } from 'react-router-dom';
import mascote from '../assets/mascote.png';

export default function Register() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.formSection}>
          <h1 style={styles.title}>HouseFix</h1>
          <p style={styles.subtitle}>Crie sua conta</p>

          <input type="text" placeholder="Nome completo" style={styles.input} />
          <input type="email" placeholder="E-mail" style={styles.input} />
          <input type="date" placeholder="Data de nascimento" style={styles.input} />
          <input type="password" placeholder="Senha" style={styles.input} />
          <input type="password" placeholder="Confirmar senha" style={styles.input} />

          <button style={styles.button}>Registrar</button>
          <p style={styles.link}>
            Já tem uma conta? <Link to="/">Entrar</Link>
          </p>
        </div>
        <div style={styles.imageSection}>
          <img src={mascote} alt="Mascote HouseFix" style={styles.image} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#eaf4fd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
    width: 900,
    maxWidth: '100%',
  },
  formSection: {
    flex: 1,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageSection: {
    flex: 1,
    backgroundColor: '#d2ebfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxHeight: '80%',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0b3d91',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
  },
  input: {
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #ccc',
    backgroundColor: '#f1f6fc',
  },
  button: {
    backgroundColor: '#0b3d91',
    color: 'white',
    padding: 14,
    fontSize: 16,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    fontSize: 14,
  },
};
