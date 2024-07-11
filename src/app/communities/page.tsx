"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CommunityList from "@/components/CommunityList";
import PersonalNav from "@/components/PersonalNav";

export default function CommunityPage() {

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center px-4">
        <h1 className="font-bold text-5xl mb-4 mt-20">Join a community Today</h1>
        <CommunityList />
      </main>
      <PersonalNav />
      <Footer />
    </>
  );
}
