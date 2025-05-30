import React from 'react';
import Navbar from '../components/Navbar';

export default function Prestadores() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '40px auto', padding: 30, background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2>Prestadores</h2>
        <p>Bem-vindo à tela de prestadores do HouseFix.</p>
        <div style={{ marginTop: 30, padding: 20, border: '1px solid #ccc', borderRadius: 10, backgroundColor: '#f9f9f9' }}>
          <p>Aqui você poderá gerenciar informações relacionadas a prestadores.</p>
        </div>
      </div>
    </>
  );
}
