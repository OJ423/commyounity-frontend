"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import PostCard from "@/components/PostCard"
import { getGroupById } from "@/utils/apiCalls"
import { GroupCard, GroupData, PostData } from "@/utils/customTypes"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function GroupPage() {
  const params = useParams<{group:string}>()
  const [groupData, setGroupData] = useState<GroupData>()
  const [postData, setPostData] = useState<PostData[] | [] >([])

  useEffect(() => {
    if(!params) {
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getGroupById(params.group)
        setGroupData(data.group)
        setPostData(data.posts)
      } catch(error: any) {
        console.log(error.message);
      }
    }
    fetchData()
  }, [params])

  return(
  <>
  <Header />
  <main className="flex flex-col items-center justify-center my-10 md:my-20 max-w-screen-lg mx-auto px-4">
    <section className="grid grid-cols-1 gap-16 md:grid-cols-8 md:gap-20 justify-start">
      <div className="flex flex-col gap-4 text-left justify-start items-start md:col-span-3">
        <h2 className="font-semibold text-lg">{groupData?.group_name}</h2>
        <Image 
          src="/placeholder-image.webp"
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${groupData?.group_name} profile picture`}
          className="w-full h-60 object-cover rounded mb-4 shadow-xl"
        />
        <p>{groupData?.group_bio}</p>
        <Link  href="" className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
          <span>Join</span>
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:col-span-5">
        <h2 className="font-semibold text-lg">{groupData?.group_name} Posts</h2>
        <>
        {postData.length ?
          <div className={"grid grid-cols-1 gap-8"}>
            {postData.map((post: PostData) => (
              <PostCard
                key={post.post_id}
                data={post}
              />
            ))}
          </div>
          :
          <p>This group hasn&apos;t posted yet.</p>
        }
          </>

      </div>
    </section>
  </main>
  <Footer />
  </>
  )
}