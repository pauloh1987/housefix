import React from 'react';
import { Link } from 'react-router-dom';
import mascote from '../assets/mascote.png';

export default function Login() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.formContainer}>
          <h1 style={styles.logo}>HouseFix</h1>
          <p style={styles.subtitle}>Bem-vindo de volta!</p>
          <input
            type="text"
            placeholder="E-mail ou telefone"
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            style={styles.input}
          />
          <button style={styles.button}>Entrar</button>
          <p style={styles.registerLink}>
            Não tem uma conta? <Link to="/registrar">Crie uma conta</Link>
          </p>
        </div>
        <div style={styles.imageContainer}>
          <img src={mascote} alt="Mascote HouseFix" style={styles.image} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#e8f1fb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    display: 'flex',
    maxWidth: '900px',
    width: '100%',
    overflow: 'hidden',
  },
  formContainer: {
    flex: 1,
    padding: '48px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0a3d91',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
  },
  input: {
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '14px',
    backgroundColor: '#0a3d91',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  registerLink: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#444',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#e8f1fb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
  },
  image: {
    width: '100%',
    maxWidth: '350px',
  },
};
