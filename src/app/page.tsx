import CommunityList from "@/components/CommunityList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PersonalNav from "@/components/PersonalNav";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <Header />
    <main className="flex min-h-screen flex-col items-center px-4">
      <section className="mx-auto py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-screen-xl">
        <div className="md:w-4/5 md:w-full mx-auto">
          <h1 className="font-bold text-3xl lg:text-5xl mb-8">Comm-you-nity</h1>
          <p className="font-medium text-lg">Connect with your local community in a whole new way. Commyounity unites residents, schools, churches, and businesses to share news, events, and offers. Prioritizing your privacy, we don&apos;t sell your data or use intrusive algorithms. Join us today to build genuine connections and strengthen community bonds.</p>
          <div className="flex gap-4">
            <Link href="/login" className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Sign up</span>
            </Link>
            <Link href="/communities" className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Communities</span>
            </Link>

          </div>
        </div>
        <div className="flex justify-center md:justify-end md:pl-8 xl:pl-20">
          <Image 
            src='/commyounity-hero-image.svg'
            width={200}
            height={200}
            className="w-full md:w-4/5 rounded-lg"
            style={{borderRadius:"40px"}}
            alt="Commyounity - An app to share local news and build community."
          />
        </div>
      </section>
      <CommunityList />
    </main>
    <PersonalNav />
    <Footer />
    </>
  );
}
