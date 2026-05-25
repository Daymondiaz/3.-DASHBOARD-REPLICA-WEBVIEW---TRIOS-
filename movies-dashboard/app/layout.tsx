"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };

    getUser();

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  return (
    <html lang="es">
      <body>

        {/* 🔥 MENÚ GLOBAL */}
        <nav style={{
          padding: "15px",
          background: "#eee",
          display: "flex",
          gap: "20px",
          justifyContent: "center"
        }}>

          {!user ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Registro</Link>
            </>
          ) : (
            <>
              <Link href="/">Home</Link>
              <Link href="/mvp">MVP</Link>
              <Link href="/user">Usuario</Link>
            </>
          )}

        </nav>

        <main>{children}</main>

      </body>
    </html>
  );
}