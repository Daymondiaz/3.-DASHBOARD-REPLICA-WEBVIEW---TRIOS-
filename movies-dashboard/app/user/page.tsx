"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Estudiante{
id:string;
nombre:string;
correo:string;
telefono:string | null;
}

export default function UserPage(){

const router=useRouter();

const [estudiante,setEstudiante]=
useState<Estudiante|null>(null);

const [nombre,setNombre]=
useState("");

const [telefono,setTelefono]=
useState("");

const [correo,setCorreo]=
useState("");

const [message,setMessage]=
useState("");

const [loading,setLoading]=
useState(true);



useEffect(()=>{

const cargarUsuario=async()=>{

const {
data:{user}
}=await supabase.auth.getUser();


if(!user){

router.push("/login");
return;

}


const {data,error}=await supabase

.from("estudiantes")

.select("*")

.eq("id",user.id)

.single();


if(error){

setMessage(
"❌ "+error.message
);

}else if(data){

setEstudiante(data);

setNombre(
data.nombre || ""
);

setTelefono(
data.telefono || ""
);

setCorreo(
data.correo || ""
);

}

setLoading(false);

};

cargarUsuario();

},[router]);



const guardarCambios=
async()=>{

if(!estudiante){

setMessage(
"❌ usuario no encontrado"
);

return;

}


const {
data,
error

}=await supabase

.from("estudiantes")

.update({

nombre,
telefono,
correo

})

.eq(
"id",
estudiante.id
)

.select();



console.log(data);
console.log(error);


if(error){

setMessage(
"❌ "+error.message
);

}else{

setMessage(
"✅ cambios guardados"
);

}

};



const cerrarSesion=
async()=>{

await supabase.auth.signOut();

router.push("/login");

};



if(loading){

return(

<p className="
text-center
mt-10
">

Cargando...

</p>

)

}



return(

<div className="
max-w-md
mx-auto
mt-10
border
rounded-lg
shadow
p-6
">

<h1 className="
text-2xl
font-bold
text-center
mb-6
">

Mi Perfil

</h1>



<label>

Nombre

</label>

<input

type="text"

placeholder="
Ej: Daymon Diaz
"

value={nombre}

onChange={(e)=>
setNombre(
e.target.value
)}

className="
border
p-2
rounded
w-full
mb-4
"

/>




<label>

Telefono

</label>

<input

type="text"

placeholder="
Ej: 3001234567
"

value={telefono}

onChange={(e)=>
setTelefono(
e.target.value
)}

className="
border
p-2
rounded
w-full
mb-4
"

/>




<label>

Correo

</label>

<input

type="email"

placeholder="
correo@gmail.com
"

value={correo}

onChange={(e)=>
setCorreo(
e.target.value
)}

className="
border
p-2
rounded
w-full
mb-5
"

/>




<button

onClick={
guardarCambios
}

className="
bg-blue-600
text-white
p-2
rounded
w-full
hover:bg-blue-700
"

>

Guardar cambios

</button>




<button

onClick={
cerrarSesion
}

className="
bg-red-600
text-white
p-2
rounded
w-full
mt-4
hover:bg-red-700
"

>

Cerrar sesión

</button>




{

message &&

<p className="
mt-5
text-center
">

{message}

</p>

}



</div>

)

}