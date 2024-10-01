"use client";

import CommunityCard from "@/components/CommunityCard";
import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfilePagesNav from "@/components/ProfilePagesNav";
import { getCommunities } from "@/utils/apiCalls";
import { Community } from "@/utils/customTypes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserCommunities() {
  const { user, communities } = useAuth();

  const [userCommunities, setUserCommunities] = useState<Community[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCommunities();
        const communityMemberships = data.communities.filter((c: Community) =>
          communities.some((uc) => uc.community_id === c.community_id)
        );
        setUserCommunities(communityMemberships);
      } catch (error: any) {
        console.log(error.message);
      }
      fetchData();
    };
    fetchData();
  }, [communities]);

  return (
    <>
      {user ? (
        <main className="flex min-h-screen flex items-center">
          <>
            <ProfilePagesNav />
            {communities.length > 0 ? (
              <section className="px-4 py-16 md:p-8 lg:p-8 w-full">
                <div className="pb-8 mb-8 border-b border-gray-300 lg:w-3/4 xl:w-2/3">
                  <h1 className="font-bold text-2xl md:text-3xl pb-4">
                    Here are the communities you are a member of
                  </h1>
                  <p>
                    Jump in one to see what&apos;s new and start interacting
                    with your fellow comm-you-nity members..
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                  {userCommunities.map((community: Community) => (
                    <CommunityCard
                      key={community.community_id}
                      community={community}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <section className="px-4 py-16 md:p-8 lg:p-16 w-full">
                <div>
                  <h1 className="font-bold text-2xl md:text-3xl pb-4">
                    You do not belong to any communities
                  </h1>
                  <p className="mb-8">
                    Join or create one to begin your comm-you-nity journey.
                  </p>
                  <Link
                    href="/communities"
                    className="text-xs w-max border-solid border-4 border-black py-4 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                  >
                    <span>Choose a community</span>
                  </Link>
                </div>
              </section>
            )}
          </>
        </main>
      ) : (
        <>
          <Header />
          <main className="flex justify-center items-center w-full my-20">
            <p>You need to be signed in to see your communities</p>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
