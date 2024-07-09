"use client";

import Footer from "@/components/Footer";
import GenericCard from "@/components/GenericCard";
import Header from "@/components/Header";
import { useAuth } from "@/components/context/AuthContext";
import { getCommunityChurches } from "@/utils/apiCalls";
import { CardData } from "@/utils/customTypes";
import { transformChurchData } from "@/utils/dataTransformers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Churches() {
  const { selectedCommunity, communities } = useAuth();
  const [ churchData, setChurchData] = useState<CardData[] | []>([]);
  const [communityMember, setCommunityMember] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function handleCreateChurch() {
    alert("this is a placeholder for creating a new church")
  }

  useEffect(() => {
    if (!selectedCommunity) {
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getCommunityChurches(
          String(selectedCommunity?.community_id)
        );
        const communityExists = communities.some(
          (community) => community.community_id === +selectedCommunity.community_id
        );
        if (communityExists) {
          setCommunityMember(true)
        }
        const churches: CardData[] = await transformChurchData(data.churches);
        setChurchData(churches);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [selectedCommunity]);

  return (
    <>
      <Header />
      <main className="flex flex-col items-center px-4 py-20 justify-center">
        <>
          {selectedCommunity ?
            <section id="#groups" className="max-w-screen-lg">
              <h1 className="font-bold text-3xl mb-4">
                Churches in {selectedCommunity.community_name}
              </h1>
              <>
              {churchData.length ?
                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"}>
                  {churchData.map((church: CardData) => (
                    <GenericCard
                      key={church.id}
                      data={church}
                      urlParams={"/churches/"}
                    />
                  ))}
                </div>
                :
                <div className="grid grid-cols-1 gap-8">
                  {communityMember ?
                  <section className="flex flex-col gap-4 justify-center items-start">
                    <Image 
                      src='/empty-placeholder.jpg'
                      quality={80}
                      alt="An empty subway train"
                      priority
                      width={400}
                      height={200}
                      className="rounded shadow-xl"
                    />
                    <h2 className="font-semibold text-2xl">There are no churches</h2>
                    <p>Why not create one?</p>
                    <Link href='' onClick={handleCreateChurch} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                      <span>Create New Group</span>
                    </Link>
                  </section>
                  :
                  <section className="flex flex-col gap-4 justify-center items-start">
                    <Image 
                      src='/empty-placeholder.jpg'
                      quality={80}
                      alt="An empty subway train"
                      priority
                      width={400}
                      height={200}
                      className="rounded shadow-xl"
                    />
                    <h2 className="font-semibold text-2xl">There are no churches</h2>
                    <p>Join the community to create one</p>
                    <Link href={`/communities/${selectedCommunity.community_name}?community=${selectedCommunity.community_id}`} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                      <span>Visit the community to join</span>
                    </Link>
                  </section>
                  }
                </div>
              
              }
              </>
            </section>
            : 
            <section className="min-h-96 flex flex-col justify-center items-start">
              <h2 className="font-bold text-2xl mb-4">No community selected</h2>
              <p className="text-xl font-medium">Please <Link className="text-indigo-500 hover:text-indigo-300 transition-all duration-500" href='/communities'>select a community</Link> to see its churches.</p>
            </section>
          }
        </>
      </main>
      <Footer />
    </>
  );
}
