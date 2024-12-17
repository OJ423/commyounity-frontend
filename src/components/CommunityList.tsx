"use client";

import { getCommunities } from "@/utils/apiCalls";
import { Community } from "@/utils/customTypes";
import { useEffect, useState } from "react";
import CommunityCard from "./CommunityCard";
import { useAuth } from "./context/AuthContext";
import { LogUserOut } from "@/utils/logOut";
import Link from "next/link";
import CommunitySearch from "./CommunitySearch";

export default function CommunityList() {
  const [communityList, setCommunityList] = useState<Community[] | []>([]);
  const [communitySearch, setCommunitySearch] = useState<Community[] | []>([]);
  const [limit, setLimit] = useState<number>(6);
  function handleLimit() {
    setLimit((currentLimit) => currentLimit + 6);
  }
  const {
    user,
    setToken,
    setUser,
    setAdminCommunities,
    setUserMemberships,
    setSelectedCommunity,
    setCommunities,
    setUserPostLikes,
    setUserAdmins,
  } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localToken = localStorage.getItem("token");
        const data = await getCommunities(localToken, limit);
        setCommunityList(data.communities);
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        }
        if (data.token === null) {
          LogUserOut({
            setToken,
            setUser,
            setCommunities,
            setSelectedCommunity,
            setUserMemberships,
            setUserAdmins,
            setUserPostLikes,
            setAdminCommunities,
          });
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [limit]);

  return (
    <section className="flex flex-col gap-8 max-w-screen-lg mx-auto my-10">
      <h2 className="font-bold text-3xl">Active Communities</h2>
      {communityList.length > 3 && (
        <CommunitySearch
          communityList={communityList}
          setCommunitySearch={setCommunitySearch}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {communityList.length ? (
          communitySearch.length ? (
            <>
              {communitySearch.map((community: Community) => (
                <CommunityCard
                  key={community.community_id}
                  community={community}
                />
              ))}
            </>
          ) : (
            <>
              {communityList.map((community: Community) => (
                <CommunityCard
                  key={community.community_id}
                  community={community}
                />
              ))}
              {communityList.length < limit ? null : (
                <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-3">
                  <button
                    onClick={handleLimit}
                    className="w-max mx-auto border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )
        ) : (
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-3">
            <p>There are no communities.</p>
            {user ? (
              <Link
                href="/communities"
                className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out w-max"
              >
                Create one
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
              >
                Sign Up & Create one
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
