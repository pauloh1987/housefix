import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  arrayUnion
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ChamadosPendentes() {
  const [chamados, setChamados] = useState([]);
  const [especialidade, setEspecialidade] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChamados = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const prestadorRef = doc(db, "usuarios", user.uid);
      const prestadorSnap = await getDoc(prestadorRef);

      if (prestadorSnap.exists()) {
        const dados = prestadorSnap.data();
        const esp = dados.especialidade || "";
        setEspecialidade(esp);

        const q = query(
          collection(db, "agendamentos"),
          where("status", "==", "Pendente"),
          where("especialidade", "==", esp)
        );
        const snap = await getDocs(q);

        const data = await Promise.all(
          snap.docs.map(async (chamadoDoc) => {
            const chamado = chamadoDoc.data();

            if ((chamado.recusados || []).includes(user.uid)) return null;

            const clienteRef = doc(db, "usuarios", chamado.clienteId);
            const clienteSnap = await getDoc(clienteRef);
            const clienteData = clienteSnap.exists() ? clienteSnap.data() : {};

            return {
              id: chamadoDoc.id,
              ...chamado,
              clienteFoto: clienteData.foto || null,
              clienteNome: clienteData.nome || "Cliente"
            };
          })
        );

        setChamados(data.filter(c => c !== null));
      }
    };

    fetchChamados();
  }, []);

  const aceitarChamado = async (id) => {
    await updateDoc(doc(db, "agendamentos", id), {
      status: "Aceito",
      prestadorId: auth.currentUser.uid,
      notificarCliente: true
    });

    setChamados(chamados.filter(c => c.id !== id));

    Swal.fire({
      icon: "success",
      title: "Chamado aceito!",
      text: "Você aceitou o chamado com sucesso.",
      confirmButtonText: "OK",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: "center"
    });
  };

  const recusarChamado = async (id) => {
    await updateDoc(doc(db, "agendamentos", id), {
      recusados: arrayUnion(auth.currentUser.uid)
    });

    setChamados(chamados.filter(c => c.id !== id));

    Swal.fire({
      icon: "info",
      title: "Chamado recusado",
      text: "Você recusou o chamado.",
      confirmButtonText: "OK",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: "center"
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chamados Pendentes</h2>
      {chamados.length === 0 ? (
        <p>Nenhum chamado pendente compatível com sua especialidade ({especialidade}).</p>
      ) : (
        chamados.map((chamado) => (
          <div key={chamado.id} style={styles.card}>
            {chamado.clienteFoto && (
              <div style={styles.clienteInfo}>
                <img
                  src={chamado.clienteFoto}
                  alt="Foto do cliente"
                  style={styles.fotoCliente}
                />
                <p style={styles.nomeCliente}>{chamado.clienteNome}</p>
              </div>
            )}

            <div style={styles.infoBox}>
              <p style={styles.label}>Especialidade</p>
              <p style={styles.value}>{chamado.especialidade}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Descrição</p>
              <p style={styles.value}>{chamado.descricao}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Data e Hora</p>
              <p style={styles.value}>
                {chamado.data} às {chamado.hora}
              </p>
            </div>

            <div style={styles.buttons}>
              <button onClick={() => aceitarChamado(chamado.id)} style={styles.buttonAceitar}>
                Aceitar Chamado
              </button>
              <button onClick={() => recusarChamado(chamado.id)} style={styles.buttonRecusar}>
                Recusar Chamado
              </button>
              <button
                onClick={() => navigate(`/perfil-cliente/${chamado.clienteId}`)}
                style={styles.buttonPerfil}
              >
                Ver Perfil do Cliente
              </button>
              <button
                onClick={() => navigate(`/chat/${chamado.id}`)}
                style={styles.buttonChat}
              >
                Abrir Chat
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
  },
  title: {
    marginBottom: 20,
    color: "#0B4DA1",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    marginBottom: 24,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    maxWidth: 600,
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
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 16,
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
  buttons: {
    display: "flex",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  buttonAceitar: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
  buttonRecusar: {
    backgroundColor: "#F44336",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
  buttonPerfil: {
    backgroundColor: "#0B4DA1",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
  buttonChat: {
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
};
