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

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  // 🔒 VALIDACIÓN + CARGA (igual que tu código pero mejorado)
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
        .maybeSingle(); // 🔥 CAMBIO CLAVE

      if (error) {
        setMessage("❌ " + error.message);
      } else if (data) {

        setEstudiante(data);

        setNombre(data.nombre || "");
        setTelefono(data.telefono || "");
        setCorreo(data.correo || "");

      } else {
        setMessage("❌ No existe perfil en la BD");
      }

      setLoading(false);
    };

    cargarUsuario();

  }, [router]);


  // 🔄 UPDATE (solo nombre y teléfono como dice la guía)
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
        // ❌ quitamos correo (la guía dice NO editarlo)
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

    <div className="max-w-md mx-auto mt-10 border rounded-lg shadow p-6">

      <h1 className="text-2xl font-bold text-center mb-6">
        Mi Perfil
      </h1>

      {/* NOMBRE */}
      <label>Nombre</label>

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />


      {/* TELÉFONO */}
      <label>Teléfono</label>

      <input
        type="text"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />


      {/* CORREO (SOLO LECTURA 🔥) */}
      <label>Correo</label>

      <input
        type="email"
        value={correo}
        readOnly
        className="border p-2 rounded w-full mb-5 bg-gray-100"
      />


      {/* BOTÓN GUARDAR */}
      <button
        onClick={guardarCambios}
        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
      >
        Guardar cambios
      </button>


      {/* 🔥 BOTÓN MVP (IMPORTANTE PARA SIMILITUD) */}
      <button
        onClick={() => router.push("/mvp")}
        className="bg-green-600 text-white p-2 rounded w-full mt-4 hover:bg-green-700"
      >
        Ver películas
      </button>


      {/* LOGOUT */}
      <button
        onClick={cerrarSesion}
        className="bg-red-600 text-white p-2 rounded w-full mt-4 hover:bg-red-700"
      >
        Cerrar sesión
      </button>


      {message && (
        <p className="mt-5 text-center">
          {message}
        </p>
      )}

    </div>

  );
}