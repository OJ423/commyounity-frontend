"use client"
 
import { getCommunities } from "@/utils/apiCalls"
import { Community } from "@/utils/customTypes"
import { useEffect, useState } from "react"
import CommunityCard from "./CommunityCard";

export default function CommunityList() {
  const [communityList, setCommunityList] = useState<Community[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCommunities()
        setCommunityList(data.communities)
      }  
      catch(error:any) {
        console.log(error.message)
      }
    }
    fetchData()
  },[]);

  return (
    <section className="flex flex-col gap-8 max-w-screen-lg mx-auto my-20">
      <h2 className="font-bold text-3xl">Active Communities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {communityList.map((community: Community) => (
            <CommunityCard key={community.community_id} community={community} />
        ))}
      </div>
    </section>
  )
}