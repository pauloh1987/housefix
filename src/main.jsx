// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';

import { AuthProvider } from './AuthProvider';

import Login from './pages/Login';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Prestadores from './pages/Prestadores';
import Ordens from './pages/Ordens';
import Agendamentos from './pages/Agendamentos';
import Relatorios from './pages/Relatorios';
import Pagamentos from './pages/Pagamentos';
import Avaliacoes from './pages/Avaliacoes';
import Tipos from './pages/Tipos';
import Register from './pages/Register';
import Agendar from './pages/Agendar'; 
import PainelPrestador from './pages/PainelPrestador'; 
import Chat from './pages/Chat';
import SelecaoCadastro from './pages/SelecaoCadastro';
import AgendarChamado from './pages/AgendarChamado';
import ChamadosPendentes from './pages/ChamadosPendentes';
import MeusAgendamentosPrestador from './pages/MeusAgendamentosPrestador';
import PerfilCliente from './pages/PerfilCliente';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/prestadores" element={<Prestadores />} />
          <Route path="/ordens" element={<Ordens />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/tipos" element={<Tipos />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/agendar" element={<Agendar />} />
          <Route path="/painel-prestador" element={<PainelPrestador />} />
          <Route path="/chat/:agendamentoId" element={<Chat />} />
          <Route path="/escolher-cadastro" element={<SelecaoCadastro />} />
          <Route path="/agendar-chamado" element={<AgendarChamado />} />
          <Route path="/chamados-pendentes" element={<ChamadosPendentes />} />
          <Route path="/meus-agendamentos-prestador" element={<MeusAgendamentosPrestador />} />
          <Route path="/perfil" element={<PerfilCliente />} />


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
