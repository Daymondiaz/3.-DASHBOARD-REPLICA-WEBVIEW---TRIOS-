"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PanelUsuario() {

  const [user, setUser] = useState<any>(null);

  // 🔥 NUEVO: estados API
  const [movies, setMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  // 🔐 OBTENER USUARIO
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      // 👇 si hay usuario, cargar películas
      if (data.user) {
        cargarPeliculas();
      }
    };

    getUser();
  }, []);

  // 🎬 API MOVIES
  const cargarPeliculas = async () => {

    setLoadingMovies(true);

    try {
      const response = await fetch(
        "https://devsapihub.com/api-movies"
      );

      const data = await response.json();

      console.log(data);

      setMovies(data);

    } catch (error) {
      console.log(error);
    }

    setLoadingMovies(false);
  };

  // 🔒 LOGOUT
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ⏳ LOADING USUARIO
  if (!user) {
    return <p style={{ padding: "20px" }}>Cargando usuario...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Panel de Usuario</h1>

      {/* INFO USUARIO */}
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ID:</strong> {user.id}</p>

      <button onClick={cerrarSesion} style={{ marginBottom: "20px" }}>
        Cerrar sesión
      </button>

      {/* LOADING PELÍCULAS */}
      {loadingMovies ? (
        <h2>Cargando películas...</h2>
      ) : (

        <div className="container">

          <h2>Lista de Películas</h2>

          <div className="movies-grid">

            {movies.map((movie: any, index: number) => (

              <div
                key={index}
                className="movie-card"
              >

                <div className="movie-content">

                  <h3 className="movie-title">
                    {
                      movie.title ||
                      movie.name ||
                      "Sin título"
                    }
                  </h3>

                  <p className="movie-description">
                    {
                      movie.description ||
                      movie.synopsis ||
                      "Película disponible"
                    }
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}