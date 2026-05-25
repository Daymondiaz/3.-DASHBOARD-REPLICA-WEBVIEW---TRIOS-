"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] =
  useState<string | null>(null);

  // LOADING
  const [loading, setLoading] =
  useState(true);

  // MOVIES API
  const [movies, setMovies] =
  useState<any[]>([]);

  const [loadingMovies, setLoadingMovies] =
  useState(false);

  const router = useRouter();

  // VERIFICAR SESIÓN
  useEffect(() => {

    const checkUser = async () => {

      const { data } =
      await supabase.auth.getUser();

      if (!data.user) {

        setLoading(false);

      } else {

        cargarPeliculas();

      }

    };

    checkUser();

  }, []);

  // CARGAR PELÍCULAS
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

    setLoading(false);
    setLoadingMovies(false);

  };

  // LOGIN
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const { data, error } =
    await supabase.auth.signInWithPassword({

      email,
      password

    });

    if (error) {

      setMessage(
        "❌ " + error.message
      );

      return;
    }

    if (data.user) {

      setMessage(
        "✅ Sesión iniciada"
      );

      cargarPeliculas();

    }

  };

  // LOADING INICIAL
  if (loading) {

    return (

      <div className="loading">

        <h1>

          Verificando sesión...

        </h1>

      </div>

    );

  }

  // SI YA HAY PELÍCULAS
  if (movies.length > 0) {

    return (

      <div className="container">

        <h1 className="title">

          Movies App

        </h1>

        {

          loadingMovies && (

            <h2 className="text-center">

              Cargando películas...

            </h2>

          )

        }

        <div className="movies-grid">

          {

            movies.map((movie: any, index: number) => (

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

            ))

          }

        </div>

      </div>

    );

  }

  // LOGIN FORM
  return (

    <div className="max-w-md mx-auto mt-10 border p-6 rounded-lg shadow">

      <h1 className="text-2xl font-bold text-center mb-6">

        Iniciar Sesión

      </h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4"
      >

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e)=>
          setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>
          setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="
          bg-green-600
          text-white
          p-2
          rounded
          hover:bg-green-700
          "
        >

          Ingresar

        </button>

      </form>

      {

        message &&

        <p className="mt-5 text-center">

          {message}

        </p>

      }

      <p className="mt-5 text-center">

        ¿No tienes cuenta?

        <button
          onClick={()=>
          router.push("/register")}
          className="
          text-blue-600
          underline
          ml-2
          "
        >

          Regístrate aquí

        </button>

      </p>

    </div>

  );

}