// src/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "./firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUsuario(user);
          setCarregando(false);
        });

        return () => unsubscribe();
      })
      .catch((err) => {
        console.error("Erro ao configurar persistência:", err);
        setCarregando(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
};
