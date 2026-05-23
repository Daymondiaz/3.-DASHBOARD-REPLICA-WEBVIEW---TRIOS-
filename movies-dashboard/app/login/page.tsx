"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {

    const checkUser = async () => {

      const { data } =
      await supabase.auth.getUser();

      if (!data.user) {

        setLoading(false);

      } else {

        router.push("/user");

      }

    };

    checkUser();

  }, [router]);



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

      router.push("/user");

    }

  };


  if (loading)
    return (
      <p className="text-center mt-10">
        Verificando sesión...
      </p>
    );


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



      {message &&

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