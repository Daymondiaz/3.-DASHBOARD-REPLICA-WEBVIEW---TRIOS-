"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setLoading(false);
      } else {
        router.push("/user");
      }
    };

    checkUser();
  }, [router]);

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
      setMessage("Usuario registrado");
    }
  };

  if (loading)
    return <p>Verificando sesión...</p>;

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