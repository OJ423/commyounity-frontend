"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "./context/AuthContext";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LogUserOut } from "@/utils/logOut";




export default function NavBar() {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const { user, setToken, setUser, setCommunities, selectedCommunity, setSelectedCommunity, setUserMemberships, setUserAdmins, setUserPostLikes, setAdminCommunities } = useAuth();
  const pathname = usePathname()
  const router = useRouter()
  function handleMenuOpen():void {
    setNavOpen(!navOpen) 
  }

  function handleLogOut():void {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
      setAdminCommunities
    })
    router.push('/login')
  }
  
  return(
    <nav className="z-20">
      {user ? 
      <>
      <section className='flex flex-row justify-between px-4 xl:p-0 start-0 items-center w-[100%] max-w-screen-xl mx-auto'>
          <button onClick={handleMenuOpen}>
            <svg className={`${navOpen? 'mt-[-10px] h-8':'h-8'}`}  fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" className={`${navOpen ? 'rotate-45 origin-left transition-all duration-500':'transition-all duration-500'}`} strokeLinejoin="round" d="M3.75 6.75h16.5" />
              <path strokeLinecap="round" className={`${navOpen ? '-rotate-45 origin-right transition-all duration-500':'transition-all duration-500'}`} strokeLinejoin="round" d="M3.75 6.75h16.5" />
              <path strokeLinecap="round" className={`${navOpen ? 'opacity-0 transition-all duration-500':'transition-all duration-500 opacity-100'}`}strokeLinejoin="round" d="M3.75 12h16.5" />
              <path strokeLinecap="round" className={`${navOpen ? 'opacity-0 transition-all duration-500':'opacity-100 transition-all duration-500'}`} strokeLinejoin="round" d="M3.75 17.25h16.5" />
            </svg>
          </button>
      </section>
      <div onClick={handleMenuOpen} className={`${!navOpen ? 'invisible opacity-0': 'opacity-50'} w-full h-[100vh] top-0 left-0 bg-gray-300 fixed duration-500 ease-out transition-all cursor-pointer z-20`}>
      </div>
      <section className={`${!navOpen ? 'translate-x-[-100%]': 'translate-x-0'} w-[60vw] sm:w-[30vw] h-[100vh] bg-white left-0 top-0 opacity-100 fixed duration-500 ease-out transition-all p-8 flex flex-col gap-12 justify-center text-left items-start z-40 shadow-lg`}>
      <Link href='/'>
          <Image 
            src="/Commyounity.svg"
            alt="Commyounity Logo"
            className='w-18 h-auto'
            width={150}
            height={75}
            priority
            style={{height:'auto'}}
          />
        </Link>
        {selectedCommunity ? 
        <div>
          <p className="text-sm font-semibold text-gray-400">You&apos;re logged into:</p>
          <p className="text-sm font-semibold text-indigo-500">{selectedCommunity.community_name}</p>
        </div>
        : null
        }
        <ul className="text-left">
          <p className="text-xs uppercase font-light mt-8 text-gray-500">Explore</p>
          <Link href="/communities">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/communities') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Communities
            </li>
          </Link>

          {selectedCommunity ?
          <>
          <p className="text-xs uppercase font-light mt-8 text-gray-500">Your stuff</p>
          <Link href="/timeline">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/timeline') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Timeline
            </li>
          </Link>
          <p className="text-xs uppercase font-light mt-8 text-gray-500">In Comm-you-nity</p>
          <Link href="/groups">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/groups') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Groups
            </li>
          </Link>
          <Link href="/businesses">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/businesses') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Businesses
            </li>
          </Link>
          <Link href="/churches">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/churches') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Churches
            </li>
          </Link>
          <Link href="/schools">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/schools') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Schools
            </li>
          </Link>
          <p className="text-xs uppercase font-light mt-8 text-gray-500">You</p>
          <Link href="/profile">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/profile') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Profile
            </li>
          </Link>
          <li onClick={handleLogOut} className="list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all">
              Logout
          </li>
          </>
          :
          <>
          <p className="text-xs uppercase font-light mt-8 text-gray-500">You</p>
          {user && 
          <Link href="/profile">
            <li onClick={handleMenuOpen} className={`${pathname.includes('/profile') ? 'text-indigo-500' : 'text-auto'} list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}>
              Profile
            </li>
          </Link>
          }
          <li onClick={handleLogOut} className="list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all">
              Logout
          </li>
          </>
          }
        </ul>
      </section>

      <div onClick={handleMenuOpen} className={`${!navOpen ? 'invisible opacity-0': 'opacity-100'} fixed cursor-pointer text-gray-600 top-0 w-8 h-8 flex items-center justify-center left-0 mt-5 ml-5 z-50 transition-all duration-1000`}>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
      </>
      :
      <section className="flex gap-8 flex-wrap justify-end">
        <Link href="/communities" className={`${pathname.includes('/communities') ? 'text-indigo-500' : 'text-auto'} flex gap-2 hover:text-gray-400 transition-all duration-500 ease-out items-center`}>
          <MdOutlineHolidayVillage size={25} aria-label="View active communities"/>
          <li className="list-style-none hidden sm:block font-bold text-xs md:text-lg flex gap-4 justify-start items-center cursor-pointer">
            Communities
          </li>
        </Link>
        <Link href="/login" className={`${pathname.includes('/login') ? 'text-indigo-500' : 'text-auto'} flex gap-2 hover:text-gray-400 transition-all duration-500 ease-out items-center`}>
          <CgProfile size={25} aria-label="login or register"/>
          <li className="list-style-none hidden sm:block font-bold text-xs md:text-lg flex gap-4 justify-start items-center cursor-pointer">
            Login/Register
          </li>
        </Link>
      </section>
    }
        

    </nav>
  )
}