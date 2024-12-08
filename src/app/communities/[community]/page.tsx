"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/components/context/AuthContext";
import { getCommunityById } from "@/utils/apiCalls";
import { CommunityProfile, CardData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoPeopleOutline,
  IoSchoolOutline,
  IoStorefrontOutline,
  IoWalkOutline,
} from "react-icons/io5";
import { MdOutlineChurch } from "react-icons/md";
import GenericCard from "../../../components/GenericCard";
import CommunityList from "@/components/CommunityList";
import {
  transformBusinessData,
  transformChurchData,
  transformGroupData,
  transformSchoolData,
} from "@/utils/dataTransformers";
import CommunityButtonLogic from "@/components/CommunityButtonLogic";
import PersonalNav from "@/components/PersonalNav";
import NewGroup from "@/components/NewGroup";
import CommunityOwnerLogic from "@/components/CommunityOwnerLogic";
import FormDrawer from "@/components/FormDrawer";
import CommunityEditForm from "@/components/CommunityEditForm";
import { LogUserOut } from "@/utils/logOut";
import CommunityImgUpdate from "@/components/CommunityImgUpdate";
import { TbPhotoEdit } from "react-icons/tb";
import CommunityUserManagement from "@/components/CommunityUserManagement";

export default function CommunityPage() {
  const [communityData, setCommunityData] = useState<CommunityProfile | null>(
    null
  );
  const [groupData, setGroupData] = useState<CardData[] | []>([]);
  const [schoolData, setSchoolData] = useState<CardData[] | []>([]);
  const [churchData, setChurchData] = useState<CardData[] | []>([]);
  const [businessData, setBusinessData] = useState<CardData[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [communityMember, setCommunityMember] = useState<boolean>(false);
  const [owner, setOwner] = useState<boolean>(false);

  const {
    user,
    token,
    communities,
    selectedCommunity,
    adminCommunities,
    setAdminCommunities,
    setCommunities,
    setSelectedCommunity,
    setToken,
    setUser,
    setUserAdmins,
    setUserMemberships,
    setUserPostLikes,
  } = useAuth();

  // Edit Community
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editType, setEditType] = useState<string>("edit");
  const handleShowForm = (value: string) => {
    setEditType(value);
    setShowForm(!showForm);
  };

  // User Management
  const [showUserManagement, setShowUserManagement] = useState<boolean>(false)
  const handleShowUserManagement = () => {
    setShowUserManagement(!showUserManagement)
  }

  // Params for data fetch
  const searchParams = useSearchParams();
  const community_id = searchParams.get("community");

  // Type guard for rendered checks
  const isDefined = (value: any): value is string =>
    value !== null && value !== undefined;
  const isSelected =
    isDefined(community_id) &&
    selectedCommunity?.community_id === community_id;

  // Expired Token
  const router = useRouter();
  const invalidTokenResponse = (): void => {
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
    router.push("/login");
  };

  useEffect(() => {
    if (community_id) {
      const ownerCheck = adminCommunities.some(
        (community) => community.community_id === community_id
      );
      setOwner(ownerCheck);
    }
    const fetchData = async () => {
      try {
        const data = await getCommunityById(community_id);
        if (community_id) {
          const communityExists = communities.some(
            (community) => community.community_id === community_id
          );
          if (communityExists) {
            setCommunityMember(true);
          }
          setCommunityData(data.community[0]);
          const businesses: CardData[] = await transformBusinessData(
            data.community[0].businesses
          );
          const groups: CardData[] = await transformGroupData(
            data.community[0].groups
          );
          const churches: CardData[] = await transformChurchData(
            data.community[0].churches
          );
          const schools: CardData[] = await transformSchoolData(
            data.community[0].schools
          );
          setBusinessData(businesses);
          setChurchData(churches);
          setSchoolData(schools);
          setGroupData(groups);
          setIsLoading(false);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [community_id, adminCommunities, communities, token]);

  return (
    <>
      <Header />
      {isLoading ? (
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <p className="mt-[-120px] font-bold">Loading</p>
        </main>
      ) : (
        <main className="flex min-h-screen flex-col items-center p-4">
          {communityData ? (
            owner && showUserManagement ?
            <CommunityUserManagement
              community={communityData}
              owner={owner}
              handleShowUserManagement={handleShowUserManagement} 
              invalidTokenResponse={invalidTokenResponse}
            />
            :
            <>
              <section
                className={`${
                  owner ? "mt-10 mb-4 md:mt-10 md:mb-0" : "my-10 md:my-20"
                } max-w-screen-lg rounded drop-shadow-xl bg-gray-200 grid grid-rows-2 grid-col-1 sm:grid-flow-col pb-8 sm:pb-0 gap-8 items-center`}
              >
                <div className="row-span-3 col-span-4 relative">
                  {communityData.community_img ? (
                    <Image
                      src={communityData.community_img}
                      width={500}
                      height={500}
                      quality={60}
                      priority
                      alt={`${communityData.community_name} community image`}
                      className="w-full h-40 sm:h-96 object-cover rounded mb-4 sm:mb-0 drop-shadow-xl"
                    />
                  ) : (
                    <Image
                      src="/community-img-placeholder.jpg"
                      width={500}
                      height={500}
                      quality={60}
                      priority
                      alt={`${communityData.community_name} community image`}
                      className="w-full h-40 sm:h-96 object-cover rounded mb-4 sm:mb-0 drop-shadow-xl"
                    />
                  )}
                  {owner ? (
                    <button
                      onClick={() => handleShowForm("image")}
                      className="bottom-2 left-2 absolute text-xs bg-indigo-100 w-max p-1 inline-block rounded-xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-500 ease-out"
                    >
                      <TbPhotoEdit size={24} />
                    </button>
                  ) : null}
                </div>
                <div className="row-span-2 col-span-4 px-4 sm:px-8">
                  <h1 className="font-bold text-3xl mb-4">
                    {communityData.community_name}
                  </h1>
                  <p className="font-medium text-lg">
                    {communityData.community_description}
                  </p>
                  <div className="flex gap-4 items-center mt-4 justify-between px-2 py-4 sm:px-8 bg-gray-300 rounded">
                    <div className="flex gap-2 justify-center">
                      <IoPeopleOutline size={25} />
                      <p className="text-center font-bold">
                        {communityData.member_count}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <IoStorefrontOutline size={25} />
                      <p className="text-center font-bold">
                        {communityData.business_count}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <IoWalkOutline size={25} />
                      <p className="text-center font-bold">
                        {communityData.group_count}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <IoSchoolOutline size={25} />
                      <p className="text-center font-bold">
                        {communityData.school_count}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <MdOutlineChurch size={25} />
                      <p className="text-center font-bold">
                        {communityData.church_count}
                      </p>
                    </div>
                  </div>
                  <CommunityButtonLogic
                    setCommunityMember={setCommunityMember}
                    communityMember={communityMember}
                    setCommunityData={setCommunityData}
                  />
                </div>
              </section>

              {owner ? (
                <>
                  <section className="max-w-screen-lg flex flex-col mx-auto gap-4 my-8 p-4 bg-indigo-100 rounded-lg">
                    <CommunityOwnerLogic
                      handleDisplayForm={handleShowForm}
                      owner={owner}
                      community={communityData}
                      handleShowUserManagement={handleShowUserManagement}
                    />
                  </section>
                  <FormDrawer
                    setShowForm={setShowForm}
                    showForm={showForm}
                    handleDisplayForm={handleShowForm}
                  >
                    {editType === "image" ? (
                      <CommunityImgUpdate
                        community={communityData}
                        owner={owner}
                        handleDisplayForm={handleShowForm}
                        invalidTokenResponse={invalidTokenResponse}
                      />
                    ) : (
                      <CommunityEditForm
                        community={communityData}
                        owner={owner}
                        user_id={Number(user?.user_id)}
                        handleDisplayForm={handleShowForm}
                        invalidTokenResponse={invalidTokenResponse}
                      />
                    )}
                  </FormDrawer>
                </>
              ) : null}

              <div>
                <section id="#groups" className="max-w-screen-lg">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
                    <h2 className="font-bold text-3xl">Groups</h2>
                    {isSelected ? (
                      <Link
                        href="/groups"
                        className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                      >
                        <span>Groups Home</span>
                      </Link>
                    ) : null}
                  </div>
                  <div
                    className={`${
                      groupData.length === 0
                        ? "grid grid-cols-1 gap-8 mb-20"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                    }`}
                  >
                    {groupData.length ? (
                      <>
                        {groupData.map((group: CardData) => (
                          <>
                            <GenericCard
                              key={group.id + group.name}
                              data={group}
                              urlParams={"/groups/"}
                            />
                          </>
                        ))}
                      </>
                    ) : user ? (
                      communityMember ? (
                        <section className="max-w-screen-lg">
                          <NewGroup type="group" />
                        </section>
                      ) : (
                        <section className="max-w-screen-lg">
                          <p>Join the community to add a group.</p>
                        </section>
                      )
                    ) : (
                      <section className="max-w-screen-lg">
                        <p>Register and join the community to add a group.</p>
                        <div>
                          <Link
                            href="/login"
                            className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                          >
                            <span>Register/Login</span>
                          </Link>
                        </div>
                      </section>
                    )}
                  </div>
                </section>

                <section id="#businesses" className="max-w-screen-lg">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
                    <h2 className="font-bold text-3xl">Businesses</h2>
                    {isSelected ? (
                      <Link
                        href="/businesses"
                        className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                      >
                        <span>Businesses Home</span>
                      </Link>
                    ) : null}
                  </div>
                  <div
                    className={`${
                      businessData.length === 0
                        ? "grid grid-cols-1 gap-8 mb-20"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                    }`}
                  >
                    {businessData.length ? (
                      <>
                        {businessData.map((business: CardData) => (
                          <GenericCard
                            key={business.id + business.name}
                            data={business}
                            urlParams={"/businesses/"}
                          />
                        ))}
                      </>
                    ) : user ? (
                      communityMember ? (
                        <section className="max-w-screen-lg">
                          <NewGroup type="business" />
                        </section>
                      ) : (
                        <section className="max-w-screen-lg">
                          <p>
                            Looks like there are no businesses. Add your
                            business?
                          </p>
                        </section>
                      )
                    ) : (
                      <section className="max-w-screen-lg">
                        <p>
                          Register and join the community to add a business.
                        </p>
                        <div>
                          <Link
                            href="/login"
                            className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                          >
                            <span>Register/Login</span>
                          </Link>
                        </div>
                      </section>
                    )}
                  </div>
                </section>

                {user ? (
                  <section id="#schools" className="max-w-screen-lg">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
                      <h2 className="font-bold text-3xl">Schools</h2>
                      {isSelected ? (
                        <Link
                          href="/schools"
                          className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                        >
                          <span>Schools Home</span>
                        </Link>
                      ) : null}
                    </div>
                    <div
                      className={`${
                        schoolData.length === 0
                          ? "grid grid-cols-1 gap-8 mb-20"
                          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                      }`}
                    >
                      {schoolData.length ? (
                        <>
                          {schoolData.map((school: CardData) => (
                            <GenericCard
                              key={school.id + school.name}
                              data={school}
                              urlParams={"/schools/"}
                            />
                          ))}
                        </>
                      ) : user ? (
                        communityMember ? (
                          <section className="max-w-screen-lg">
                            <NewGroup type="school" />
                          </section>
                        ) : (
                          <section className="max-w-screen-lg">
                            <p>
                              Join the community if you are a local school admin
                              looking to add your school.
                            </p>
                          </section>
                        )
                      ) : (
                        <section className="max-w-screen-lg">
                          <p>
                            Register and join the community to add a school.
                          </p>
                          <div>
                            <Link
                              href="/login"
                              className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                            >
                              <span>Register/Login</span>
                            </Link>
                          </div>
                        </section>
                      )}
                    </div>
                  </section>
                ) : null}

                <section id="#churches" className="max-w-screen-lg">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b-2">
                    <h2 className="font-bold text-3xl">Churches</h2>
                    {isSelected ? (
                      <Link
                        href="/churches"
                        className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                      >
                        <span>Churches Home</span>
                      </Link>
                    ) : null}
                  </div>

                  <div
                    className={`${
                      churchData.length === 0
                        ? "grid grid-cols-1 gap-8 mb-20"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                    }`}
                  >
                    {churchData.length ? (
                      <>
                        {churchData.map((church: CardData) => (
                          <GenericCard
                            key={church.id + church.name}
                            data={church}
                            urlParams={"/churches/"}
                          />
                        ))}
                      </>
                    ) : user ? (
                      communityMember ? (
                        <section className="max-w-screen-lg">
                          <NewGroup type="church" />
                        </section>
                      ) : (
                        <section className="max-w-screen-lg">
                          <p>
                            Join the community and add your church if you are a
                            local church admin.
                          </p>
                        </section>
                      )
                    ) : (
                      <section className="max-w-screen-lg">
                        <p>Register and join the community to add a church.</p>
                        <div>
                          <Link
                            href="/login"
                            className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                          >
                            <span>Register/Login</span>
                          </Link>
                        </div>
                      </section>
                    )}
                  </div>
                </section>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-bold text-3xl mb-4">
                Join a community Today
              </h1>
              <CommunityList />
            </>
          )}
        </main>
      )}
      <PersonalNav />
      <Footer />
    </>
  );
}
