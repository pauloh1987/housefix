// main.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./style.css";

// Páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Prestadores from './pages/Prestadores';
import Ordens from './pages/Ordens';
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
import PerfilCliente from './pages/PerfilCliente';
import MeusAgendamentosPrestador from './pages/MeusAgendamentosPrestador';
import MeusAgendamentosCliente from './pages/MeusAgendamentosCliente.jsx';
import PerfilPrestador from './pages/PerfilPrestador.jsx';
import PerfilClientePublico from './pages/PerfilClientePublico.jsx';
import HistoricoPrestador from './pages/HistoricoPrestador.jsx';
import HistoricoCliente from "./pages/HistoricoCliente";
import LayoutComNavbar from './components/LayoutComNavbar.jsx';

function AppRoutes() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsubscribe();
  }, []);

  if (carregando) return <p style={{ padding: 20 }}>Carregando...</p>;

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/escolher-cadastro" element={<SelecaoCadastro />} />

      {/* Rotas protegidas */}
      {usuario ? (
        <Route element={<LayoutComNavbar />}>
          <Route path="/home" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/prestadores" element={<Prestadores />} />
          <Route path="/ordens" element={<Ordens />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/tipos" element={<Tipos />} />
          <Route path="/agendar" element={<Agendar />} />
          <Route path="/painel-prestador" element={<PainelPrestador />} />
          <Route path="/chat/:agendamentoId" element={<Chat />} />
          <Route path="/agendar-chamado" element={<AgendarChamado />} />
          <Route path="/chamados-pendentes" element={<ChamadosPendentes />} />
          <Route path="/perfil-cliente" element={<PerfilCliente />} />
          <Route path="/meus-agendamentos-prestador" element={<MeusAgendamentosPrestador />} />
          <Route path="/agendamentos" element={<MeusAgendamentosCliente />} />
          <Route path="/perfil-prestador" element={<PerfilPrestador />} />
          <Route path="/perfil-cliente/:id" element={<PerfilClientePublico />} />
          <Route path="/historico-prestador" element={<HistoricoPrestador />} />
          <Route path="/historico" element={<HistoricoCliente />} />
        </Route>
      ) : (
        // Redireciona qualquer rota privada para login
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
