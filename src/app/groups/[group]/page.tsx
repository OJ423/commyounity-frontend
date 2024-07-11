"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import MembershipButtonLogic from "@/components/MembershipButtonLogic"
import PersonalNav from "@/components/PersonalNav"
import PostCard from "@/components/PostCard"
import { useAuth } from "@/components/context/AuthContext"
import { getGroupById } from "@/utils/apiCalls"
import { GroupData, PostData } from "@/utils/customTypes"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function GroupPage() {
  const params = useParams<{group:string}>()
  const [groupData, setGroupData] = useState<GroupData>()
  const [postData, setPostData] = useState<PostData[] | [] >([])
  const [member, setMember] = useState<boolean>(false)
  const {userMemberships} = useAuth()

  useEffect(() => {
    if(!params) {
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getGroupById(params.group)
        setGroupData(data.group)
        setPostData(data.posts)
        if(userMemberships) {
          const memberCheck = userMemberships?.userMemberships?.groups.some(
            (g) => g.group_id === data.group.group_id
          );
          if (memberCheck) {
            setMember(true)
          }
        }
      } catch(error: any) {
        console.log(error.message);
      }
    }
    fetchData()
  }, [userMemberships, params])

  return(
  <>
  <Header />
  <main className="flex flex-col items-center justify-center my-10 md:my-20 max-w-screen-xl mx-auto px-4">
    <section className="grid grid-cols-1 gap-16 md:grid-cols-8 md:gap-20 justify-start">
      <div className="flex flex-col gap-4 text-left justify-start items-start md:col-span-3">
        <h1 className="font-semibold text-xl md:text-2xl">{groupData?.group_name}</h1>
        {groupData?.group_img ?
        <Image 
          src={groupData.group_img}
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${groupData?.group_name} profile picture`}
          className="w-full h-60 object-cover rounded mb-4 shadow-xl"
        />
        :
        <Image 
          src="/placeholder-image.webp"
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${groupData?.group_name} profile picture`}
          className="w-full h-60 object-cover rounded mb-4 shadow-xl"
        />
        }
        <p>{groupData?.group_bio}</p>
        <MembershipButtonLogic member={member} setMember={setMember} type="group" id={groupData?.group_id} />
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
                member={member}
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
  <PersonalNav />
  <Footer />
  </>
  )
}