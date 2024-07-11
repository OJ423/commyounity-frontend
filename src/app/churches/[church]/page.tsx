"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import MembershipButtonLogic from "@/components/MembershipButtonLogic"
import PersonalNav from "@/components/PersonalNav"
import PostCard from "@/components/PostCard"
import { useAuth } from "@/components/context/AuthContext"
import { getChurchById } from "@/utils/apiCalls"
import { ChurchData, PostData } from "@/utils/customTypes"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IoMailOutline, IoArrowRedoOutline } from "react-icons/io5";


export default function ChurchPage() {
  const params = useParams<{church:string}>()
  const [churchData, setChurchData] = useState<ChurchData>()
  const [postData, setPostData] = useState<PostData[] | [] >([])
  const [member, setMember] = useState<boolean>(false)
  const {userMemberships} = useAuth()

  useEffect(() => {
    if(!params) {
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getChurchById(params.church)
        setChurchData(data.church)
        setPostData(data.posts)
        if(userMemberships) {
          const memberCheck = userMemberships?.userMemberships?.churches.some(
            (c) => c.church_id === data.church.church_id
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
        <h1 className="font-semibold text-xl md:text-2xl">{churchData?.church_name}</h1>
        {churchData?.church_img ?
        <Image 
          src={churchData.church_img}
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${churchData?.church_name} profile picture`}
          className="w-full h-60 object-cover rounded mb-4 shadow-xl"
        />
        :
        <Image 
          src="/placeholder-image.webp"
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${churchData?.church_name} profile picture`}
          className="w-full h-60 object-cover rounded mb-4 shadow-xl"
        />
        }
        <p>{churchData?.church_bio}</p>
        <div className="flex justify-between w-full flex-wrap gap-1 items-center">
          {churchData?.church_email ?
          <Link className="flex gap-2 items-center" href={`mailto:${churchData?.church_email}`}> 
            <IoMailOutline size={24}/>
            <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">Email</p>
          </Link>
          : null
          }
          {churchData?.church_website ?
          <Link target="_blank" className="flex gap-2 items-center" href={`${churchData?.church_website}`}>
            <IoArrowRedoOutline size={24}/>
            <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">Website</p>
          </Link>
          : null
          }
        </div>
        <MembershipButtonLogic member={member} setMember={setMember} type="church" id={churchData?.church_id} />
      </div>
      <div className="flex flex-col gap-4 md:col-span-5">
        <h2 className="font-semibold text-lg">{churchData?.church_name} Posts</h2>
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
          <p>This church hasn&apos;t posted yet.</p>
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