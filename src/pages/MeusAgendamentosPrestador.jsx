import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MeusAgendamentosPrestador() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ id: null, descricao: "", nota: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "agendamentos"),
      where("prestadorId", "==", auth.currentUser.uid),
      where("status", "==", "Aceito")
    );

    const unsubscribe = onSnapshot(q, async (snap) => {
      const lista = [];

      for (const docAg of snap.docs) {
        const dados = docAg.data();
        const clienteSnap = await getDocs(
          query(collection(db, "usuarios"), where("uid", "==", dados.clienteId))
        );
        const cliente = !clienteSnap.empty ? clienteSnap.docs[0].data() : null;
        lista.push({ id: docAg.id, ...dados, cliente });
      }

      setAgendamentos(lista);
    });

    return () => unsubscribe();
  }, []);

  const formatarDataHora = (dataStr, horaStr) => {
    try {
      const [ano, mes, dia] = dataStr.split("-");
      const dataFormatada = new Date(`${ano}-${mes}-${dia}T${horaStr}`);
      return dataFormatada.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }) + ` às ${horaStr}`;
    } catch (err) {
      return `${dataStr} às ${horaStr}`;
    }
  };

  const abrirModal = (id) => {
    setModalInfo({ id, descricao: "", nota: 0 });
    setModalOpen(true);
  };

  const finalizarServico = async () => {
    const { id, descricao, nota } = modalInfo;
    if (!descricao || nota === 0) return Swal.fire("Preencha todos os campos antes de concluir o serviço.");

    const chamadoRef = doc(db, "agendamentos", id);
    const chamadoSnap = await getDoc(chamadoRef);
    const chamadoData = chamadoSnap.data();

    await updateDoc(chamadoRef, {
      status: "Concluído",
      descricaoConclusao: descricao,
      feedback: {
        texto: descricao,
        estrelas: nota,
        clienteNome: chamadoData.clienteNome || "Cliente"
      },
    });

    setModalOpen(false);
    Swal.fire({
      icon: "success",
      title: "Serviço concluído",
      text: "O serviço foi marcado como concluído com sucesso!",
      confirmButtonText: "OK"
    });
  };

  const selecionarNota = (valor) => {
    setModalInfo((prev) => ({ ...prev, nota: valor }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Meus Agendamentos</h2>
      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <div style={styles.lista}>
          {agendamentos.map((a) => (
            <div key={a.id} style={styles.card}>
              {a.cliente?.foto && (
                <div style={styles.clienteInfo}>
                  <img src={a.cliente.foto} alt="Cliente" style={styles.fotoCliente} />
                  <p style={styles.nomeCliente}>{a.cliente.nome}</p>
                </div>
              )}

              <div style={styles.infoBox}>
                <p style={styles.label}>Email</p>
                <p style={styles.value}>{a.cliente?.email || "Não informado"}</p>
              </div>

              <div style={styles.infoBox}>
                <p style={styles.label}>Serviço</p>
                <p style={styles.value}>{a.especialidade}</p>
              </div>

              <div style={styles.infoBox}>
                <p style={styles.label}>Descrição</p>
                <p style={styles.value}>{a.descricao}</p>
              </div>

              <div style={styles.infoBox}>
                <p style={styles.label}>Data e Hora</p>
                <p style={styles.value}>{formatarDataHora(a.data, a.hora)}</p>
              </div>

              <button onClick={() => navigate(`/chat/${a.id}`)} style={styles.botao}>
                Entrar no Chat
              </button>

              <button onClick={() => abrirModal(a.id)} style={styles.botaoConcluir}>
                Finalizar Serviço
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Finalizar Serviço</h3>
            <textarea
              placeholder="Descreva o que foi feito"
              value={modalInfo.descricao}
              onChange={(e) => setModalInfo({ ...modalInfo, descricao: e.target.value })}
              style={styles.textarea}
            />
            <div style={styles.estrelas}>
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => selecionarNota(num)}
                  style={{
                    fontSize: 28,
                    cursor: "pointer",
                    color: modalInfo.nota >= num ? "#FFD700" : "#ccc",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <button onClick={finalizarServico} style={styles.botaoFinalizar}>
              Finalizar
            </button>
            <button onClick={() => setModalOpen(false)} style={styles.botaoCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 30,
  },
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    width: "100%",
    maxWidth: 600,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },
  clienteInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  fotoCliente: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #0B4DA1",
  },
  nomeCliente: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 17,
    color: "#0B4DA1",
  },
  infoBox: {
    backgroundColor: "#f0f4ff",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#0B4DA1",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#333",
    margin: 0,
  },
  botao: {
    marginTop: 14,
    backgroundColor: "#0B4DA1",
    color: "#fff",
    padding: "12px 18px",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    width: "100%",
  },
  botaoConcluir: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "12px 18px",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    width: "100%",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 10,
    fontSize: 15,
    marginBottom: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  estrelas: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
  },
  botaoFinalizar: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 10,
    width: "100%",
  },
  botaoCancelar: {
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    width: "100%",
  },
};
