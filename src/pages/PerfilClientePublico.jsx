import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function PerfilClientePublico() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "usuarios", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setCliente(snap.data());
      }

      const q = query(
        collection(db, "agendamentos"),
        where("clienteId", "==", id),
        where("status", "==", "Concluído")
      );
      const snapHist = await getDocs(q);
      const lista = snapHist.docs.map(doc => doc.data());
      setHistorico(lista);
    };

    fetchData();
  }, [id]);

  const formatarDataHora = (data, hora) => {
    try {
      const dataObj = new Date(`${data}T${hora}`);
      const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      return `${dataFormatada} - ${horaFormatada}`;
    } catch {
      return `${data} - ${hora}`;
    }
  };

  if (!cliente) return <p style={{ padding: 20 }}>Carregando perfil...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src={cliente.foto || "https://via.placeholder.com/120"}
          alt="Foto do cliente"
          style={styles.avatar}
        />
        <h2 style={styles.nome}>{cliente.nome}</h2>

        <h3 style={styles.subtitulo}>Serviços Realizados</h3>
        {historico.length === 0 ? (
          <p style={styles.vazio}>Nenhum serviço encontrado.</p>
        ) : (
          <ul style={styles.lista}>
            {historico.map((h, i) => (
              <li key={i} style={styles.item}>
                <strong>{h.especialidade}</strong><br />
                📅 {formatarDataHora(h.data, h.hora)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    backgroundColor: "#f3f6fb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    maxWidth: 500,
    width: "100%",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 16,
    border: "3px solid #0B4DA1",
  },
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B4DA1",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  vazio: {
    color: "#777",
    fontSize: 15,
  },
  lista: {
    listStyle: "none",
    padding: 0,
    textAlign: "left",
    marginTop: 10,
  },
  item: {
    padding: 10,
    borderBottom: "1px solid #eee",
    fontSize: 15,
    color: "#333",
  },
};
