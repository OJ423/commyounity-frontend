"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { getUsersCommunityPosts } from "@/utils/apiCalls";
import { PostData, TimelinePosts } from "@/utils/customTypes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Timeline() {
  const { user, selectedCommunity } = useAuth();
  const [userPosts, setUserPosts] = useState<TimelinePosts[] | []>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [member, setMember] = useState<boolean>(true)

  function handleFilterGroups() {
    setFilter('groups')
  }

  function handleFilterSchools() {
    setFilter('schools')
  }

  function handleFilterChurches() {
    setFilter('churches')
  }

  function handleClearFilter() {
    setFilter(null)
  }

  useEffect(() => {
    if (user && selectedCommunity) {
      const fetchData = async() => {
        try {
          const data = await getUsersCommunityPosts(+user.user_id, selectedCommunity.community_id, filter)
          setUserPosts(data.posts)

        } catch(error:any) {
          console.log(error)
        }
      }
      fetchData()
    }
  },[user, selectedCommunity, filter])



  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center px-4">
        {selectedCommunity ?
        <>
        <section className="w-full sm:w-4/5 lg:w-3/5 xl:w-2/5 mb-8 pb-8 mt-10 border-b border-gray-300 max-w-screen-xl">
          <h1 className="font-semibold text-3xl mb-8">Memberships Posts</h1>
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-start sm:items-center p-4 bg-gray-300 shadow-xl rounded">
            <p className="font-semibold text-xs">Filter by...</p>
            <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
              <Link href="" onClick={handleFilterGroups}
                className={`${filter === 'groups' ? 'bg-indigo-500 text-white border-indigo-500' : null} text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
              >
                <span>Groups</span>
              </Link>
              <Link href="" onClick={handleFilterSchools}
                className={`${filter === 'schools' ? 'bg-indigo-500 text-white border-indigo-500' : null} text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
              >
                <span>Schools</span>
              </Link>
              <Link href="" onClick={handleFilterChurches}
                className={`${filter === 'churches' ? 'bg-indigo-500 text-white border-indigo-500' : null} text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
              >
                <span>Churches</span>
              </Link>
              {filter ?
              <Link href="" onClick={handleClearFilter}
                className={`text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
              >
              <span>All</span>
              </Link>
              : null    
              }
            </div>
          </div>  
        </section>
        <section className="w-full sm:w-4/5 lg:w-3/5 xl:w-2/5 mb-20">
        <div className="flex flex-col gap-4 md:col-span-5">
        <>
        {userPosts.length > 0 ?
          <div className={"grid grid-cols-1 gap-8"}>
            {userPosts.map((post: TimelinePosts) => (
              <PostCard
                key={post.post_id}
                data={post}
                member={member}
              />
            ))}
          </div>
          :
          <p>{`There are no posts :(`}</p>
        }
          </>

      </div>
        </section>
        </>
      : 
      <section className="w-full sm:w-4/5 lg:w-3/5 xl:w-2/5 mt-[-90px]">
        <h2 className="font-semibold text-2xl mb-8">Please select a community</h2>
        <p className="mb-8">Posts are associated to a community. Select a community to see the posts of your memberships.</p>
        <Link href="/communities"
              className="text-xs w-max border-solid border-4 border-black py-4 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
        >
          <span>Choose a community</span>
        </Link>
      </section>  
      }
      </main>
      <Footer />
    </>
  );
}
