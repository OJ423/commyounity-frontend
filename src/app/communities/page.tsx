"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CommunityList from "@/components/CommunityList";
import PersonalNav from "@/components/PersonalNav";
import { useAuth } from "@/components/context/AuthContext";
import CommunityNewButton from "@/components/CommunityNewButton";

export default function CommunityPage() {

  const {user} = useAuth()

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center px-4 relative">
        <h1 className="font-bold text-4xl lg:text-5xl mb-4 mt-10 md:mt-20">Join a community Today</h1>
        <CommunityList />
        {user && 
        <CommunityNewButton />
        }
      </main>
      <PersonalNav />
      <Footer />
    </>
  );
}
