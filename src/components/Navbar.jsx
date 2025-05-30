import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🏠 HouseFix</div>
      <ul className="navbar-links">
        <li><Link to="/home">Início</Link></li>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/ordens">Ordens</Link></li>
        <li><Link to="/agendamentos">Agendamentos</Link></li>
        <li><Link to="/avaliacoes">Avaliações</Link></li>
        <li><Link to="/relatorios">Relatórios</Link></li>
        <li><Link to="/pagamentos">Pagamentos</Link></li>
        <li><Link to="/tipos">Tipos</Link></li>
      </ul>
    </nav>
  );
}
