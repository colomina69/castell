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
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }
  return (
  /*   <div className='w-full flex justify-between p-4 items-center bg-black'>
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
                <Link className='font-bold text-3xl p-8' href="/fotos" onClick={handleNav}>Fotos</Link>
                <Link className='font-bold text-3xl p-8' href="/socios" onClick={handleNav}>Socios</Link>
                <Link className='font-bold text-3xl p-8' href="/registro" onClick={handleNav}>Registro</Link>
            </ul>
        </div>
    </div> */
    <nav className="bg-gray-800 sticky top-0">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-white">Logo</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/">Castell</Link>
                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/fotos">Fotos</Link>
                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/socios">Socios</Link>
         
            </div>
          </div>
        </div>
        <div className="-mr-2 flex md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
    {isOpen && (
      <div className="md:hidden" id="mobile-menu ">
        <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/" onClick={toggleMenu}>Castell</Link>
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/fotos" onClick={toggleMenu}>Fotos</Link>
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/socios" onClick={toggleMenu}>Socios</Link>
        </div>
      </div>
    )}
  </nav>

  )
}

export default Navbar