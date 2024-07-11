"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import MembershipButtonLogic from "@/components/MembershipButtonLogic"
import PersonalNav from "@/components/PersonalNav"
import PostCard from "@/components/PostCard"
import { useAuth } from "@/components/context/AuthContext"
import { getBusinessById } from "@/utils/apiCalls"
import { BusinessData, PostData } from "@/utils/customTypes"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IoMailOutline, IoArrowRedoOutline } from "react-icons/io5";


export default function BusinessPage() {
  const params = useParams<{business:string}>()
  const [businessData, setBusinessData] = useState<BusinessData>()
  const [postData, setPostData] = useState<PostData[] | [] >([])
  const [member, setMember] = useState<boolean>(true)
  const {userMemberships} = useAuth()

  useEffect(() => {
    if(!params) {
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getBusinessById(params.business)
        setBusinessData(data.business)
        setPostData(data.posts)
        if(userMemberships) {
          const memberCheck = userMemberships?.userMemberships?.businesses.some(
            (b) => b.business_id === data.business.business_id
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
        <h1 className="font-semibold text-xl md:text-2xl">{businessData?.business_name}</h1>
        {businessData?.business_img ?
        <Image 
          src={businessData.business_img}
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${businessData?.business_name} profile picture`}
          className="w-full h-60 object-cover rounded mb-4 shadow-xl"
        />
        :
        <Image 
          src="/placeholder-image.webp"
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${businessData?.business_name} profile picture`}
          className="w-full h-60 object-cover rounded mb-4 shadow-xl"
        />
        }
        <p>{businessData?.business_bio}</p>
        <div className="flex justify-between w-full flex-wrap gap-1 items-center">
          {businessData?.business_email ?
          <Link className="flex gap-2 items-center" href={`mailto:${businessData?.business_email}`}> 
            <IoMailOutline size={24}/>
            <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">Email</p>
          </Link>
          : null
          }
          {businessData?.business_website ?
          <Link target="_blank" className="flex gap-2 items-center" href={`${businessData?.business_website}`}>
            <IoArrowRedoOutline size={24}/>
            <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">Website</p>
          </Link>
          : null
          }
        </div>
        <MembershipButtonLogic member={member} setMember={setMember} type="business" id={businessData?.business_id} />
      </div>
      <div className="flex flex-col gap-4 md:col-span-5">
        <h2 className="font-semibold text-lg">{businessData?.business_name} Posts</h2>
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
          <p>This business hasn&apos;t posted yet.</p>
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