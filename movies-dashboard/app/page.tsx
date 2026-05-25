"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎬 CARGAR PELÍCULAS
  useEffect(() => {

    const cargarPeliculas = async () => {

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

      setLoading(false);

    };

    cargarPeliculas();

  }, []);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">
          Cargando películas...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">

      <h1 className="text-4xl font-bold text-center mb-8">
        🎬 Movies App
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {movies.map((movie: any, index: number) => (

          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
          >

            <h2 className="text-xl font-bold mb-2 text-center">
              {
                movie.title ||
                movie.name ||
                "Sin título"
              }
            </h2>

            <p className="text-gray-600 text-sm text-center">
              {
                movie.description ||
                movie.synopsis ||
                "Película disponible"
              }
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}