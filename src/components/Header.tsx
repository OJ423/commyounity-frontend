"use client"

import Image from 'next/image'
import Link from 'next/link'
import NavBar from './NavBar'
import { useAuth } from './context/AuthContext'

export default function Header() {
  const { selectedCommunity } = useAuth()

  return(
    <header className="w-[100%] box-sizing p-4 bg-white shadow-lg">
      <section className='flex flex-row justify-between max-w-screen-xl mx-auto items-center gap-2'>
        <Link href='/'>
          <Image 
            src="/Commyounity.svg"
            alt="Commyounity Logo"
            className='w-40 md:w-60'
            width={250}
            height={12}
            priority
            style={{height:'auto'}}
          />
        </Link>
        <div className='flex gap-2 md:gap-4 items-center'>
          {selectedCommunity ?
          <p className='text-xs font-semibold text-center'> {selectedCommunity.community_name}</p>
          :
          null  
          }
          <NavBar />
        </div>

      </section>

    </header>
  )
}