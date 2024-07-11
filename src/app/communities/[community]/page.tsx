"use client"

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/components/context/AuthContext";
import { getCommunityById } from "@/utils/apiCalls";
import { CommunityProfile, CardData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { IoPeopleOutline, IoSchoolOutline, IoStorefrontOutline, IoWalkOutline } from "react-icons/io5";
import { MdOutlineChurch } from "react-icons/md";
import GenericCard from "../../../components/GenericCard";
import CommunityList from "@/components/CommunityList";
import { transformBusinessData, transformChurchData, transformGroupData, transformSchoolData } from "@/utils/dataTransformers";
import CommunityButtonLogic from "@/components/CommunityButtonLogic";
import PersonalNav from "@/components/PersonalNav";


export default function CommunityPage() {
  const [communityData, setCommunityData] = useState<CommunityProfile | null>(null)
  const [groupData, setGroupData] = useState<CardData[] | []>([])
  const [schoolData, setSchoolData] = useState<CardData[] | []>([])
  const [churchData, setChurchData] = useState<CardData[] | []>([])
  const [businessData, setBusinessData] = useState<CardData[] | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [communityMember, setCommunityMember] = useState<boolean>(false)

  const { user, communities, selectedCommunity } = useAuth()
  
  // Params for data fetch
  const searchParams = useSearchParams()
  const community_id = searchParams.get('community')
    // Type guard for rendered checks
    const isDefined = (value: any): value is string => value !== null && value !== undefined;
    const isSelected = isDefined(community_id) && selectedCommunity?.community_id === +community_id;
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCommunityById(community_id)
        if (community_id) {
          const communityExists = communities.some(
            (community) => community.community_id === +community_id
          );
          if (communityExists) {
            setCommunityMember(true)
          }
          setCommunityData(data.community[0])
          const businesses:CardData[] = await transformBusinessData(data.community[0].businesses)
          const groups:CardData[] = await transformGroupData(data.community[0].groups)
          const churches:CardData[] = await transformChurchData(data.community[0].churches) 
          const schools:CardData[] = await transformSchoolData(data.community[0].schools) 
          setBusinessData(businesses)
          setChurchData(churches)
          setSchoolData(schools)
          setGroupData(groups)
          setIsLoading(false)
        }
      }  
      catch(error:any) {
        console.log(error.message)
      }
    }
    fetchData()
  },[community_id]);
    
  return (
    <>
    <Header />
      {isLoading ?
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="mt-[-120px] font-bold">Loading</p>
      </main>
      :
      <main className="flex min-h-screen flex-col items-center px-4">
      {
      communityData ?
        <>
        <section className="max-w-screen-lg rounded drop-shadow-xl bg-gray-200 my-10 md:my-20 grid grid-rows-2 grid-col-1 sm:grid-flow-col pb-8 sm:pb-0 gap-8 items-center">
            <div className="row-span-3 col-span-4">
            <Image
              src={communityData.community_img}
              width={200}
              height={200}
              quality={60}
              priority
              alt={`${communityData.community_name} community image`}
              className="w-full h-40 sm:h-96 object-cover rounded mb-4 sm:mb-0 drop-shadow-xl"
            />
            </div>
            <div className="row-span-2 col-span-4 px-4 sm:px-8">
              <h1 className="font-bold text-3xl mb-4">{communityData.community_name}</h1>
              <p className="font-medium text-lg">{communityData.community_description}</p>
              <div className="flex gap-4 items-center mt-4 justify-between px-2 py-4 sm:px-8 bg-gray-300 rounded">
                <div className="flex gap-2 justify-center">
                  <IoPeopleOutline size={25} />
                  <p className="text-center font-bold">{communityData.member_count}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <IoStorefrontOutline size={25} />
                  <p className="text-center font-bold">{communityData.business_count}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <IoWalkOutline size={25} />
                  <p className="text-center font-bold">{communityData.group_count}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <IoSchoolOutline size={25} />
                  <p className="text-center font-bold">{communityData.school_count}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <MdOutlineChurch size={25} />
                  <p className="text-center font-bold">{communityData.church_count}</p>
                </div>
              </div>
              <CommunityButtonLogic setCommunityMember={setCommunityMember} communityMember={communityMember} setCommunityData={setCommunityData} />             
            </div>
        </section>

        <div>

          <section id="#groups" className="max-w-screen-lg">
            <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
              <h2 className="font-bold text-3xl">Groups</h2>
              {isSelected ? 
              <Link href="/groups" className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Groups Home</span>
              </Link>
              :
              null
              }
            </div>
            <div className={`${groupData.length === 0 ? "grid grid-cols-1 gap-8 mb-20" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"}`}>
              {groupData.length ?
              <>
                {groupData.map((group: CardData) => (
                  <>
                    <GenericCard key={group.id} data={group} urlParams={'/groups/'} />
                  </>
                ))}
              </>
              :
              user ? communityMember ?
              <section className="max-w-screen-lg">
                <p>Looks like there are no groups. Why not create one?</p>
                <div>
                  <Link  href='/groups/add' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                    <span>Add Group</span>
                  </Link>
                </div>
              </section>
              :
              <section className="max-w-screen-lg">
              <p>Join the community to add a group?</p>
              <div>
                <Link  href='#' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Join</span>
                </Link>
              </div>
            </section>
            :
            <section className="max-w-screen-lg">
              <p>Register and join the community to add a group.</p>
              <div>
                <Link  href='/login' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Register/Login</span>
                </Link>
              </div>
            </section>
              }
            </div>
          </section>

          <section id="#businesses" className="max-w-screen-lg">
          <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
              <h2 className="font-bold text-3xl">Businesses</h2>
              {isSelected ? 
              <Link href="/businesses" className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Businesses Home</span>
              </Link>
              :
              null
              }
            </div>
            <div className={`${businessData.length === 0 ? "grid grid-cols-1 gap-8 mb-20" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"}`}>
              {businessData.length ?
              <>
                {businessData.map((business: CardData) => (
                  <GenericCard key={business.id} data={business} urlParams={'/businesses/'} />
                ))}
              </>
              :
              user ? communityMember ?
              <section className="max-w-screen-lg">
                <p>Looks like there are no businesses. Why not list yours?</p>
                <Link  href='/businesses/add' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Add Business</span>
                </Link>
              </section>
              :
              <section className="max-w-screen-lg">
              <p>Looks like there are no businesses. Why not register and list yours?</p>
              <div>
                <Link  href='#' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Join</span>
                </Link>
              </div>
            </section>
            :
            <section className="max-w-screen-lg">
            <p>Register and join the community to add a business.</p>
            <div>
              <Link  href='/login' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                <span>Register/Login</span>
              </Link>
            </div>
          </section>
            }
            </div>
          </section>

          <section id="#schools" className="max-w-screen-lg">
             <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
              <h2 className="font-bold text-3xl">Schools</h2>
              {isSelected ? 
              <Link href="/schools" className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Schools Home</span>
              </Link>
              :
              null
              }
            </div>
            <div className={`${schoolData.length === 0 ? "grid grid-cols-1 gap-8 mb-20" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"}`}>
              {schoolData.length ?
              <>
                {schoolData.map((school: CardData) => (
                  <GenericCard key={school.id} data={school} urlParams={'/schools/'} />
                ))}
              </>
              :
              user ? communityMember ?
              <section className="max-w-screen-lg">
                <p>Looks like there are no schools. Create your school to communicate with parents and pupils?</p>
                <Link  href='/schools/add' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Add School</span>
                </Link>
              </section>
              :
              <section className="max-w-screen-lg">
              <p>Join the community if you are a local school admin looking to add your school.</p>
              <div>
                <Link  href='#' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Join</span>
                </Link>
              </div>
            </section>
            :
            <section className="max-w-screen-lg">
            <p>Register and join the community to add a school.</p>
            <div>
              <Link  href='/login' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                <span>Register/Login</span>
              </Link>
            </div>
          </section>
              }
            </div>
          </section>


          <section id="#churches" className="max-w-screen-lg">
            <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
              <h2 className="font-bold text-3xl">Churches</h2>
              {isSelected ? 
              <Link href="/churches" className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                <span>Churches Home</span>
              </Link>
              :
              null
              }
            </div>

            <div className={`${churchData.length === 0 ? "grid grid-cols-1 gap-8 mb-20" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"}`}>
              {churchData.length ?
              <>
                {churchData.map((church: CardData) => (
                  <GenericCard key={church.id} data={church} urlParams={'/churches/'} />
                ))}
              </>
              :
              user ? communityMember ?
              <section className="max-w-screen-lg">
                <p>Looks like there are no churches. Create your church to communicate with the community.</p>
                <Link  href='/schools/add' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Add Church</span>
                </Link>
              </section>
              :
              <section className="max-w-screen-lg">
              <p>Join the community and add your church if you are a local church admin.</p>
              <div>
                <Link  href='#' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                  <span>Join</span>
                </Link>
              </div>
            </section>
            :
            <section className="max-w-screen-lg">
            <p>Register and join the community to add a church.</p>
            <div>
              <Link  href='/login' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                <span>Register/Login</span>
              </Link>
            </div>
          </section>
              }
            </div>
          </section>
        </div>

        </>
        :
        <>
        <h1 className="font-bold text-3xl mb-4">Join a community Today</h1>
        <CommunityList />
        </>
        }
      </main>
      }
    <PersonalNav />
    <Footer />
  </>
  )
  
}