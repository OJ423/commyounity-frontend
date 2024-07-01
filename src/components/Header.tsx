import Image from 'next/image'
import Link from 'next/link'
import NavBar from './NavBar'

export default function Header() {
  return(
    <header className="w-[100%] box-sizing p-4 bg-white shadow-lg">
      <section className='flex flex-row justify-between max-w-screen-xl mx-auto items-center'>
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
        <NavBar />

      </section>

    </header>
  )
}