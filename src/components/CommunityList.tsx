"use client";

import { getCommunities } from "@/utils/apiCalls";
import { Community } from "@/utils/customTypes";
import { useEffect, useState } from "react";
import CommunityCard from "./CommunityCard";
import { useAuth } from "./context/AuthContext";
import { LogUserOut } from "@/utils/logOut";

export default function CommunityList() {
  const [communityList, setCommunityList] = useState<Community[] | []>([]);
  const {
    setToken,
    setUser,
    setAdminCommunities,
    setUserMemberships,
    setSelectedCommunity,
    setCommunities,
    setUserPostLikes,
    setUserAdmins
  } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localToken = localStorage.getItem("token")
        const data = await getCommunities(localToken);
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
            setAdminCommunities
          })
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-8 max-w-screen-lg mx-auto my-20">
      <h2 className="font-bold text-3xl">Active Communities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {communityList.map((community: Community) => (
          <CommunityCard key={community.community_id} community={community} />
        ))}
      </div>
    </section>
  );
}
