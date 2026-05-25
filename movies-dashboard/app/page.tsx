"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Movie = any;

export default function Page() {

  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔒 VALIDAR USUARIO (IMPORTANTE PARA TU NOTA)
  useEffect(() => {

    const checkUser = async () => {

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      fetchMovies();
    };

    checkUser();

  }, [router]);


  // 🎬 API
  const fetchMovies = async () => {

    try {

      const response = await fetch(
        "https://devsapihub.com/api-movies"
      );

      const data = await response.json();

      console.log("API:", data);

      // 🔥 FIX DEFINITIVO (como tú lo hiciste, pero mejorado)
      const peliculas =
        Array.isArray(data)
          ? data
          : data.movies ||
            data.results ||
            data.data ||
            [];

      setMovies(peliculas);

    } catch (error) {
      console.log(error);
      setMovies([]);
    }

    setLoading(false);
  };


  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };


  if (loading) {
    return (
      <main style={styles.loading}>
        <h1>Cargando películas...</h1>
      </main>
    );
  }

  return (
    <main style={styles.container}>

      {/* 🔥 HEADER TIPO DASHBOARD */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>

        <h1 style={styles.titulo as React.CSSProperties}>
          🎬 Movies App
        </h1>

        <button
          onClick={() => router.push("/panel")}
          style={styles.boton}
        >
          Ir al Panel
        </button>

        <button
          onClick={cerrarSesion}
          style={{ ...styles.boton, background: "red" }}
        >
          Cerrar sesión
        </button>

      </div>


      {/* GRID */}
      <div style={styles.grid}>

        {movies.map((movie, index) => (

          <div key={index} style={styles.card}>

            <div style={styles.info}>

              <h2 style={styles.nombre}>
                {movie.title || movie.name || "Sin título"}
              </h2>

              <p style={styles.descripcion}>
                {
                  movie.description ||
                  movie.synopsis ||
                  "Sin descripción"
                }
              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}


const styles = {

  container:{
    background:"#111",
    minHeight:"100vh",
    padding:"40px"
  },

  loading:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:"100vh",
    background:"#111",
    color:"white"
  },

  titulo:{
    color:"white",
    fontSize:"45px",
    textAlign:"center",
    marginBottom:"20px"
  },

  boton:{
    margin:"10px",
    padding:"10px 20px",
    borderRadius:"8px",
    border:"none",
    cursor:"pointer",
    background:"#2563eb",
    color:"white"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",
    gap:"25px"
  },

  card:{
    background:"#1e1e1e",
    borderRadius:"15px",
    overflow:"hidden",
    boxShadow:
    "0 10px 20px rgba(0,0,0,.4)",
    transition:"0.3s"
  },

  info:{
    padding:"15px"
  },

  nombre:{
    color:"white",
    fontSize:"22px",
    marginBottom:"10px"
  },

  descripcion:{
    color:"#bcbcbc",
    fontSize:"15px",
    lineHeight:"1.5"
  }

};