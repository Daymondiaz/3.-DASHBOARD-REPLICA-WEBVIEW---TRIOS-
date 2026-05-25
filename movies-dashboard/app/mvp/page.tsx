"use client";

import { useEffect, useState } from "react";
import "./style.css";

export default function MVPPage() {

    const [movies, setMovies] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const cargarPeliculas = async () => {

            try {

                const response =
                    await fetch(
                        "https://devsapihub.com/api-movies"
                    );

                const data =
                    await response.json();

                setMovies(data);

            } catch (error) {

                console.log(error);

            }

            setLoading(false);

        };

        cargarPeliculas();

    }, []);



    if (loading) {

        return (

            <div className="loading">

                Cargando películas...

            </div>

        );

    }



    return (

        <div className="container">

            <div className="header">

                <h1 className="title">

                    Movies App

                </h1>


                <div className="nav-buttons">

                    <a href="/login">

                        <button>
                            Iniciar sesión
                        </button>

                    </a>


                    <a href="/register">

                        <button>
                            Crear cuenta
                        </button>

                    </a>


                    <a href="/user">

                        <button>
                            Mi perfil
                        </button>

                    </a>

                </div>

            </div>



            <div className="movies-grid">

                {

                    movies.map(
                        (
                            movie:any,
                            index:number
                        ) => (

                        <div
                        key={index}
                        className="movie-card"
                        >

                            <div
                            className="movie-content"
                            >

                                <h2
                                className="movie-title"
                                >

                                    {

                                    movie.title ||

                                    movie.name ||

                                    "Sin título"

                                    }

                                </h2>


                                <p
                                className="movie-description"
                                >

                                    {

                                    movie.description ||

                                    movie.synopsis ||

                                    "Película"

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