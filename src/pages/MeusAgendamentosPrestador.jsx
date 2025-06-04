import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MeusAgendamentosPrestador() {
  const [agendamentos, setAgendamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "agendamentos"),
        where("prestadorId", "==", auth.currentUser.uid),
        where("status", "in", ["Aceito", "Concluído"])
      );
      const snap = await getDocs(q);
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
    };

    fetch();
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

  const finalizarServico = async (id) => {
    const confirmacao = window.confirm("Deseja marcar este serviço como concluído?");
    if (!confirmacao) return;

    const descricaoConclusao = window.prompt("Descreva o que foi feito no serviço:");
    const nota = window.prompt("De 1 a 5 estrelas, qual nota você dá ao serviço?");

    await updateDoc(doc(db, "agendamentos", id), {
      status: "Concluído",
      descricaoConclusao: descricaoConclusao || "",
      avaliacao: Number(nota) || null,
    });

    alert("Serviço finalizado com sucesso!");
    setAgendamentos(prev => prev.filter(a => a.id !== id));
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

              <button
                onClick={() => navigate(`/chat/${a.id}`)}
                style={styles.botao}
              >
                Entrar no Chat
              </button>

              {a.status === "Aceito" && (
                <button
                  onClick={() => finalizarServico(a.id)}
                  style={styles.botaoConcluir}
                >
                  Finalizar Serviço
                </button>
              )}
            </div>
          ))}
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
};
