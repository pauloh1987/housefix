import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    birth: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const validateCPF = (cpf) => {
    return /^\d{11}$/.test(cpf.replace(/\D/g, ''));
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCPF(formData.cpf)) {
      alert('CPF inválido. Digite apenas os 11 números.');
      return;
    }
    alert('Conta criada com sucesso!');
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, opacity: 1, transform: 'scale(1)', transition: 'all 0.3s ease-in-out' }}>
        <h2 style={styles.title}>Criar Conta - HouseFix</h2>
        <form onSubmit={step === 1 ? nextStep : handleSubmit} style={styles.form}>
          {step === 1 ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>Próximo</button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="phone"
                placeholder="Telefone (com DDD)"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="cpf"
                placeholder="CPF (apenas números)"
                value={formData.cpf}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="date"
                name="birth"
                value={formData.birth}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Endereço"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>Finalizar Cadastro</button>
            </>
          )}
        </form>
        <p style={styles.link}>
          Já tem uma conta? <Link to="/" style={{ color: '#2196f3' }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5'
  },
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    boxShadow: '0 0 25px rgba(0, 0, 0, 0.06)',
    textAlign: 'center'
  },
  title: {
    marginBottom: 20,
    color: '#222',
    fontWeight: 600
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  input: {
    padding: 12,
    border: '1px solid #ccc',
    borderRadius: 10,
    fontSize: 15
  },
  button: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    marginTop: 8
  },
  link: {
    marginTop: 20,
    fontSize: 14
  }
};
