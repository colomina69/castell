'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import {HiMenuAlt3} from 'react-icons/hi'

type Props = {}

const Navbar = (props: Props) => {
  const [nav, setNav]=useState(false);
  const handleNav=()=>{
    setNav(!nav);
    if(!nav){
        document.body.style.overflow='hidden'
    } else {
        document.body.style.overflow='scroll'
    }
  };
  return (
    <div className='w-full flex justify-between p-4 items-center bg-black'>
        <h1 className='text-white font-bold text-2xl z-20'>Moros del castell</h1>
        <HiMenuAlt3 onClick={handleNav} className='z-20 text-white cursor-pointer'/>
        <div 
            className={
                nav
                    ? 'ease-in duration-300 fixed text-gray-300 left-0 top-0 w-full h-screen bg-black/90 px-4 py-7 flex-col z-10'
                    :'absolute top-0 h-screen left-[-100%] ease-in duration-500 z-10'
            }
        >
            <ul className='flex flex-col fixed w-full h-full items-center justify-center'>
                <Link className='font-bold text-3xl p-8' href="/" onClick={handleNav}>Castell</Link>
                <Link className='font-bold text-3xl p-8' href="/contacto" onClick={handleNav}>Contacto</Link>
                <Link className='font-bold text-3xl p-8' href="/fiestas" onClick={handleNav}>Fiestas</Link>
                <Link className='font-bold text-3xl p-8' href="/socios" onClick={handleNav}>Socios</Link>
                <Link className='font-bold text-3xl p-8' href="/registro" onClick={handleNav}>Registro</Link>
            </ul>
        </div>
    </div>
  )
}

export default Navbar