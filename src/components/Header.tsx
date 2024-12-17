"use client"

import Image from 'next/image'
import Link from 'next/link'
import NavBar from './NavBar'
import { useAuth } from './context/AuthContext'

export default function Header() {
  const { selectedCommunity, user } = useAuth()

  return(
    <header className="w-[100%] box-sizing p-4 bg-white shadow-lg">
      <section className='flex flex-row justify-between max-w-screen-xl mx-auto items-center gap-2'>
        <Link href='/'>
          <Image 
            src="/Commyounity.svg"
            alt="Commyounity Logo"
            className='w-40'
            width={250}
            height={125}
            priority
            style={{height:'auto'}}
          />
        </Link>
        <div className='flex gap-2 md:gap-4 items-center'>
          {selectedCommunity ?
          <p className='text-xs font-light text-center'> {selectedCommunity.community_name}</p>
          :
          null  
          }
          <div className='flex gap-2 items-center'>
          {user?
            <Link className='w-12 h-12' href="/profile">
              {user.user_avatar ?
              <Image 
                src={user.user_avatar}
                alt='Click to visit profile page'
                width={40}
                height={40}
                className='rounded-full object-cover w-full h-full'
              />
              :
              <Image 
                src={'/blank_user_avatar.png'}
                alt='Click to visit profile page'
                width={20}
                height={20}
                className='rounded-full object-cover w-full h-full'
              />
              }
            </Link>
            : null
            }
            <NavBar />
          </div>
        </div>

      </section>

    </header>
  )
}