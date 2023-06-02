
'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Page = () => {
  const [fotos, setFotos] = useState<Fotos[]>([]);

  useEffect(() => {
    const obtenerFotos = async () => {
      try {
        const respuesta = await fetch('http://www.morosdelcastell.com:3001/files/1947');
        const data = await respuesta.json();
        setFotos(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    obtenerFotos();
  }, []);

  return (
    <div>
      {fotos.map((foto) => (
        <div key={foto.name}>
          <p>Nombre: {foto.name}</p>
          <Image src={`http://www.morosdelcastell.com:3001${foto.path}`} width={500} height={500} alt={foto.name}/>
        </div>
      ))}
    </div>
  );
};

export default Page;

type Fotos = {
  name: string;
  path: string;
}