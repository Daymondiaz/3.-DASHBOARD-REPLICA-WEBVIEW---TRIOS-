"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Estudiante {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
}

export default function UserPage() {

  const router = useRouter();

  const [estudiante, setEstudiante] =
    useState<Estudiante | null>(null);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const [message, setMessage] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // 🔥 NUEVO: API MOVIES
  const [movies, setMovies] =
    useState<any[]>([]);

  const [loadingMovies, setLoadingMovies] =
    useState(true);


  // 🔒 VALIDACIÓN + CARGA
  useEffect(() => {

    const cargarUsuario = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("estudiantes")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setMessage("❌ " + error.message);
      } else if (data) {

        setEstudiante(data);

        setNombre(data.nombre || "");
        setTelefono(data.telefono || "");
        setCorreo(data.correo || "");

        cargarPeliculas(); // 👈 cargar API aquí

      } else {
        setMessage("❌ No existe perfil en la BD");
      }

      setLoading(false);
    };

    cargarUsuario();

  }, [router]);


  // 🎬 API MOVIES
  const cargarPeliculas = async () => {

    setLoadingMovies(true);

    try {

      const response = await fetch(
        "https://devsapihub.com/api-movies"
      );

      const data = await response.json();

      setMovies(data);

    } catch (error) {
      console.log(error);
    }

    setLoadingMovies(false);
  };


  // 🔄 UPDATE
  const guardarCambios = async () => {

    if (!estudiante) {
      setMessage("❌ usuario no encontrado");
      return;
    }

    const { error } = await supabase
      .from("estudiantes")
      .update({
        nombre,
        telefono
      })
      .eq("id", estudiante.id);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ cambios guardados");
    }
  };


  // 🚪 LOGOUT
  const cerrarSesion = async () => {

    await supabase.auth.signOut();
    router.push("/login");

  };


  if (loading) {
    return (
      <p className="text-center mt-10">
        ⏳ Cargando...
      </p>
    );
  }


  return (

    <div className="max-w-4xl mx-auto mt-10 p-6">

      {/* PERFIL */}
      <div className="border rounded-lg shadow p-6 mb-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Mi Perfil
        </h1>

        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <label>Teléfono</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <label>Correo</label>
        <input
          type="email"
          value={correo}
          readOnly
          className="border p-2 rounded w-full mb-5 bg-gray-100"
        />

        <button
          onClick={guardarCambios}
          className="bg-blue-600 text-white p-2 rounded w-full mb-3"
        >
          Guardar cambios
        </button>

        <button
          onClick={cerrarSesion}
          className="bg-red-600 text-white p-2 rounded w-full"
        >
          Cerrar sesión
        </button>

        {message && (
          <p className="mt-5 text-center">
            {message}
          </p>
        )}

      </div>

      {/* 🎬 PELÍCULAS */}
      <div>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Películas
        </h2>

        {loadingMovies ? (
          <p className="text-center">
            Cargando películas...
          </p>
        ) : (

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

        )}

      </div>

    </div>
  );
}