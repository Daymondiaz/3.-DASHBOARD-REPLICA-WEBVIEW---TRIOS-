"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  // FORM
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] =
  useState<string | null>(null);

  // LOADING
  const [loading, setLoading] = useState(true);

  // 🔥 API MOVIES
  const [movies, setMovies] =
  useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] =
  useState(false);

  const router = useRouter();

  // 🔐 VERIFICAR SESIÓN
  useEffect(() => {

    const checkUser = async () => {

      const { data } =
      await supabase.auth.getUser();

      if (!data.user) {
        setLoading(false);
      } else {
        cargarPeliculas(); // 👈 si ya está logueado
      }

    };

    checkUser();

  }, []);

  // 🎬 CARGAR PELÍCULAS
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

    setLoading(false);
    setLoadingMovies(false);

  };

  // 📝 REGISTRO
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      setMessage(authError.message);
      return;
    }

    const userId = authData.user?.id;

    if (!userId) {
      setMessage("No se obtuvo ID");
      return;
    }

    const { error } = await supabase
      .from("estudiantes")
      .insert([
        {
          id: userId,
          nombre,
          correo: email,
          telefono,
        },
      ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Usuario registrado");
      cargarPeliculas(); // 👈 cargar API después del registro
    }

  };

  // ⏳ LOADING INICIAL
  if (loading) {
    return <p>Verificando sesión...</p>;
  }

  // 🎬 SI YA HAY PELÍCULAS
  if (movies.length > 0) {
    return (
      <div className="container">

        <h1 className="title">
          Movies App
        </h1>

        {loadingMovies && (
          <h2 className="text-center">
            Cargando películas...
          </h2>
        )}

        <div className="movies-grid">

          {movies.map((movie: any, index: number) => (

            <div
              key={index}
              className="movie-card"
            >

              <div className="movie-content">

                <h2 className="movie-title">
                  {
                    movie.title ||
                    movie.name ||
                    "Sin título"
                  }
                </h2>

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
    );
  }

  // 📝 FORM REGISTRO
  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded">

      <h1 className="text-2xl font-bold text-center mb-5">
        Registro
      </h1>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4"
      >

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e)=>
            setNombre(e.target.value)
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Telefono"
          value={telefono}
          onChange={(e)=>
            setTelefono(e.target.value)
          }
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Registrarse
        </button>

      </form>

      {message &&
        <p className="mt-4 text-center">
          {message}
        </p>
      }

      <p className="mt-5 text-center">

        ¿Ya tienes cuenta?

        <button
          onClick={()=>
            router.push("/login")
          }
          className="text-blue-500 ml-2"
        >
          Iniciar sesión
        </button>

      </p>

    </div>
  );
}