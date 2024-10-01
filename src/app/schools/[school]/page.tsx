"use client";

import AdminUserList from "@/components/AdminUserList";
import EditGroupForm from "@/components/EditGroupForm";
import EditHeaderImage from "@/components/EditHeaderImage";
import Footer from "@/components/Footer";
import FormDrawer from "@/components/FormDrawer";
import Header from "@/components/Header";
import MembershipButtonLogic from "@/components/MembershipButtonLogic";
import NewPostIcon from "@/components/NewPostIcon";
import ParentRequestForm from "@/components/ParentRequestForm";
import ParentRequestList from "@/components/ParentRequestList";
import PersonalNav from "@/components/PersonalNav";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/components/context/AuthContext";
import {
  getCommunitySchools,
  getParentAccessRequests,
  getSchoolById,
} from "@/utils/apiCalls";
import {
  SchoolData,
  PostData,
  CardData,
  ParentAccessData,
} from "@/utils/customTypes";
import { transformSchoolData } from "@/utils/dataTransformers";
import { LogUserOut } from "@/utils/logOut";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMailOutline, IoArrowRedoOutline } from "react-icons/io5";
import { LuAlertTriangle } from "react-icons/lu";

export default function SchoolPage() {
  const params = useParams<{ school: string }>();

  const [schoolData, setSchoolData] = useState<SchoolData>();
  const [parentRequestData, setParentRequestData] = useState<
    ParentAccessData[] | null
  >(null);
  const [nonParentView, setNonParentView] = useState<CardData | null>(null);
  const [postData, setPostData] = useState<PostData[] | []>([]);
  const [fetchPosts, setFetchPosts] = useState<boolean>(false);
  const [member, setMember] = useState<boolean>(true);
  const [owner, setOwner] = useState<boolean>(false);
  const [showRequests, setShowRequests] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<string>("Pending");
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  const {
    selectedCommunity,
    userMemberships,
    token,
    setToken,
    setCommunities,
    setUser,
    setSelectedCommunity,
    setUserAdmins,
    setUserMemberships,
    setUserPostLikes,
  } = useAuth();

  const [showAdminUsers, setShowAdminUsers] = useState<boolean>(false);
  const handleShowAdminUsers = () => {
    setShowRequests(false)
    setShowAdminUsers(!showAdminUsers);
  };

  const [showForm, setShowForm] = useState<boolean>(false);

  const router = useRouter();

  const handleDisplayForm = () => {
    setShowForm(!showForm);
  };

  const handleShowRequests = () => {
    setShowAdminUsers(false)
    setShowRequests(!showRequests);
  };

  const invalidTokenResponse = (): void => {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
    });
    router.push("/login");
  };

  useEffect(() => {
    if (!params) {
      return;
    }
    const localToken = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const data = await getSchoolById(+params.school, localToken);
        setSchoolData(data.school);
        setPostData(data.posts);
        if (userMemberships) {
          const memberCheck = userMemberships?.userMemberships?.schools.some(
            (b) => b.school_id === data.school.school_id
          );
          if (memberCheck) {
            setMember(true);
          }
        }
      } catch (error: any) {
        if (
          error.response.data.msg ===
          "You need to be a school parent/guardian to see school posts"
        ) {
          const fetchBackUp = async () => {
            const backUpSchoolArr = await getCommunitySchools(
              selectedCommunity?.community_id
            );
            const transformedData = await transformSchoolData(
              backUpSchoolArr.schools
            );
            for (let i = 0; i < transformedData.length; i++) {
              if (+transformedData[i].id === +params.school) {
                setNonParentView(transformedData[i]);
              }
            }
          };
          fetchBackUp();
        }
        console.log(error.response.data.msg);
      }
    };
    fetchData();

    if (owner) {
      const fetchParentRequests = async () => {
        try {
          const data = await getParentAccessRequests(
            localToken,
            +params.school,
            requestStatus
          );
          setParentRequestData(data.parentAccessRequests);
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } catch (error: any) {
          if (
            error.response.data.msg === "Authorization header missing" ||
            error.response.data.msg === "Invalid or expired token"
          ) {
            invalidTokenResponse();
          }
          console.log(error);
        }
      };
      fetchParentRequests();
    }
  }, [
    userMemberships,
    params,
    fetchPosts,
    token,
    owner,
    selectedCommunity?.community_id,
    setToken,
    requestStatus,
  ]);

  return (
    <>
      <Header />
      {nonParentView ? (
        <>
          <main className="flex flex-col items-center justify-center my-10 md:my-20 max-w-screen-xl mx-auto px-4">
            <section className="grid grid-cols-1 gap-16 md:grid-cols-8 md:gap-20 justify-start">
              <div className="flex flex-col gap-4 text-left justify-start items-start md:col-span-3">
                <h1 className="font-semibold text-xl md:text-2xl">
                  {nonParentView?.name}
                </h1>
                {nonParentView?.img ? (
                  <Image
                    src={nonParentView.img}
                    width={200}
                    height={100}
                    quality={60}
                    priority
                    alt={`${nonParentView?.name} profile picture`}
                    className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.webp"
                    width={200}
                    height={100}
                    quality={60}
                    priority
                    alt={`${nonParentView?.name} profile picture`}
                    className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                  />
                )}
                <p>{nonParentView?.bio}</p>
                {requestSubmitted ? (
                  <p className="text-green-500">
                    Your request has been sent to the school. You will receive
                    an email when they response to your request.
                  </p>
                ) : (
                  <button
                    onClick={handleDisplayForm}
                    className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                  >
                    <span>Request Parent Access</span>
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4 md:col-span-5">
                <h2 className="font-semibold text-lg">
                  {nonParentView?.name} Posts
                </h2>
                <>
                  <p>
                    You need to be a parent of this school to see its posts.
                  </p>
                </>
              </div>
            </section>
          </main>
          <FormDrawer
            setShowForm={setShowForm}
            showForm={showForm}
            handleDisplayForm={handleDisplayForm}
          >
            <h2 className="font-bold text-xl">Edit your school</h2>
            <ParentRequestForm
              handleDisplayForm={handleDisplayForm}
              invalidTokenResponse={invalidTokenResponse}
              school_id={params.school}
              requestSubmitted={requestSubmitted}
              setRequestSubmitted={setRequestSubmitted}
            />
          </FormDrawer>
        </>
      ) : (
        <main className="flex flex-col items-center justify-center my-10 md:my-20 max-w-screen-xl mx-auto px-4">
          <section className="grid grid-cols-1 gap-16 md:grid-cols-8 md:gap-20 justify-start">
            <div className="flex flex-col gap-4 text-left justify-start items-start md:col-span-3">
              {owner ? (
                parentRequestData?.length ? (
                  <div className="w-full p-4 flex flex-col gap-2 bg-indigo-200 rounded-xl">
                    <h2 className="font-light uppercase text-gray-500 text-sm">
                      Parent Access Requests:
                    </h2>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-wrap gap-4">
                        <LuAlertTriangle size={42} className="text-red-500" />
                        <p className="font-bold">
                          {parentRequestData.length} new requests
                        </p>
                      </div>
                      <button
                        className="w-max border-solid border-4 text-xs border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                        onClick={handleShowRequests}
                      >
                        {showRequests ? "View Posts" : "View Requests"}
                      </button>
                    </div>
                  </div>
                ) : null
              ) : null}
              <h1 className="font-semibold text-xl md:text-2xl">
                {schoolData?.school_name}
              </h1>
              <div className="w-full h-60 relative">
                {schoolData?.school_img ? (
                  <Image
                    src={schoolData.school_img}
                    width={200}
                    height={100}
                    quality={60}
                    priority
                    alt={`${schoolData?.school_name} profile picture`}
                    className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.webp"
                    width={200}
                    height={100}
                    quality={60}
                    priority
                    alt={`${schoolData?.school_name} profile picture`}
                    className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                  />
                )}
                <>
                  {owner ? (
                    <EditHeaderImage type="school" id={schoolData?.school_id} />
                  ) : null}
                </>
              </div>
              <p>{schoolData?.school_bio}</p>
              <div className="flex justify-between w-full flex-wrap gap-1 items-center">
                {schoolData?.school_email ? (
                  <Link
                    className="flex gap-2 items-center"
                    href={`mailto:${schoolData?.school_email}`}
                  >
                    <IoMailOutline size={24} />
                    <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">
                      Email
                    </p>
                  </Link>
                ) : null}
                {schoolData?.school_website ? (
                  <Link
                    target="_blank"
                    className="flex gap-2 items-center"
                    href={`${schoolData?.school_website}`}
                  >
                    <IoArrowRedoOutline size={24} />
                    <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">
                      Website
                    </p>
                  </Link>
                ) : null}
              </div>
              <MembershipButtonLogic
                member={member}
                setMember={setMember}
                owner={owner}
                setOwner={setOwner}
                type="school"
                id={schoolData?.school_id}
                showForm={showForm}
                setShowForm={setShowForm}
                handleShowUserAdmins={handleShowAdminUsers}
              />
            </div>
            <div className="flex flex-col gap-4 md:col-span-5">
              {showRequests ? (
                <ParentRequestList
                  requests={parentRequestData}
                  setRequestStatus={setRequestStatus}
                  invalidTokenResponse={invalidTokenResponse}
                  handleShowRequests={handleShowRequests}
                />
              ) : showAdminUsers ?
              <AdminUserList
                type="school"
                entityId={schoolData?.school_id}
                entityName={schoolData?.school_name}
                owner={owner}
                handleShowUserAdmins={handleShowAdminUsers}
              />
              : (
                <>
                  <div className="flex gap-4 items-center justify-between">
                    <h2 className="font-semibold text-lg">
                      {schoolData?.school_name} Posts
                    </h2>
                    {owner ? (
                      <NewPostIcon
                        type={"school"}
                        id={schoolData?.school_id}
                        fetchPosts={fetchPosts}
                        setFetchPosts={setFetchPosts}
                      />
                    ) : null}
                  </div>
                  <>
                    {postData.length ? (
                      <div className={"grid grid-cols-1 gap-8"}>
                        {postData.map((post: PostData) => (
                          <PostCard
                            key={post.post_id}
                            data={post}
                            member={member}
                            owner={owner}
                          />
                        ))}
                      </div>
                    ) : (
                      <p>This school hasn&apos;t posted yet.</p>
                    )}
                  </>
                </>
              )}
            </div>
          </section>
          <FormDrawer
            setShowForm={setShowForm}
            showForm={showForm}
            handleDisplayForm={handleDisplayForm}
          >
            <h2 className="font-bold text-xl">Edit your school</h2>
            <EditGroupForm
              type="school"
              entityID={schoolData?.school_id}
              propData={schoolData}
              setShowForm={setShowForm}
              showForm={showForm}
            />
          </FormDrawer>
        </main>
      )}
      <PersonalNav />
      <Footer />
    </>
  );
}
