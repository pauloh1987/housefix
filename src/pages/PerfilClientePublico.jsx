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
        where("status", "==", "concluido")
      );
      const snapHist = await getDocs(q);
      setHistorico(snapHist.docs.map(doc => doc.data()));
    };

    fetchData();
  }, [id]);

  if (!cliente) return <p>Carregando perfil...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil do Cliente</h2>
      <img
        src={cliente.foto || "https://via.placeholder.com/120"}
        alt="Foto"
        style={{ width: 120, height: 120, borderRadius: "50%" }}
      />
      <h3>{cliente.nome}</h3>

      <h4>Serviços Realizados</h4>
      {historico.length === 0 ? (
        <p>Nenhum serviço encontrado.</p>
      ) : (
        <ul>
          {historico.map((h, i) => (
            <li key={i}>{h.tipoServico} - {h.data}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
