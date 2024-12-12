"use client";

import AdminUserList from "@/components/AdminUserList";
import EditGroupForm from "@/components/EditGroupForm";
import EditHeaderImage from "@/components/EditHeaderImage";
import ExpiredTokenMessage from "@/components/ExpiredTokenMessage";
import Footer from "@/components/Footer";
import FormDrawer from "@/components/FormDrawer";
import Header from "@/components/Header";
import MembershipButtonLogic from "@/components/MembershipButtonLogic";
import NewPostIcon from "@/components/NewPostIcon";
import PersonalNav from "@/components/PersonalNav";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/components/context/AuthContext";
import { getBusinessById } from "@/utils/apiCalls";
import { BusinessData, PostData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMailOutline, IoArrowRedoOutline } from "react-icons/io5";

export default function BusinessPage() {
  const params = useParams<{ business: string }>();

  const [businessData, setBusinessData] = useState<BusinessData>();
  const [postData, setPostData] = useState<PostData[] | []>([]);
  const [fetchPosts, setFetchPosts] = useState<boolean>(false);
  const [member, setMember] = useState<boolean>(true);
  const { userMemberships, token, setToken } = useAuth();
  const [owner, setOwner] = useState<boolean>(false);
  const [authErr, setAuthErr] = useState<boolean>(false);

  const [showAdminUsers, setShowAdminUsers] = useState<boolean>(false);
  const handleShowAdminUsers = () => {
    setShowAdminUsers(!showAdminUsers);
  };

  const [showForm, setShowForm] = useState<boolean>(false);
  const handleDisplayForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    if (!params) {
      return;
    }
    const localToken = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const data = await getBusinessById(params.business, localToken);
        setBusinessData(data.business);
        setPostData(data.posts);
        setToken(data.token);
        if (userMemberships) {
          const memberCheck = userMemberships?.userMemberships?.businesses.some(
            (b) => b.business_id === data.business.business_id
          );
          if (memberCheck) {
            setMember(true);
          }
        }
      } catch (error: any) {
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          setAuthErr(true);
        } else {
          console.log(error.message);
        }
      }
    };
    fetchData();
  }, [userMemberships, params, fetchPosts, token, setToken]);

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center my-10 max-w-screen-xl mx-auto px-4">
        {authErr ? (
          <ExpiredTokenMessage />
        ) : (
          <>
            <Link
              className="text-xs font-bold text-indigo-500 hover:text-teal-500 transition-all duration-500 me-auto mb-8"
              href="/businesses"
            >{`<< Back to Businesses`}</Link>
            <section className="grid grid-cols-1 gap-16 md:grid-cols-8 md:gap-20 justify-start">
              <div className="flex flex-col gap-4 text-left justify-start items-start md:col-span-3">
                <h1 className="font-semibold text-xl md:text-2xl">
                  {businessData?.business_name}
                </h1>
                <div className="w-full h-60 relative">
                  {businessData?.business_img ? (
                    <Image
                      src={businessData.business_img}
                      width={200}
                      height={100}
                      quality={60}
                      priority
                      alt={`${businessData?.business_name} profile picture`}
                      className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                    />
                  ) : (
                    <Image
                      src="/placeholder-image.webp"
                      width={200}
                      height={100}
                      quality={60}
                      priority
                      alt={`${businessData?.business_name} profile picture`}
                      className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                    />
                  )}
                  <>
                    {owner ? (
                      <EditHeaderImage
                        type="business"
                        id={businessData?.business_id}
                      />
                    ) : null}
                  </>
                </div>
                <p>{businessData?.business_bio}</p>
                <div className="flex justify-between w-full flex-wrap gap-1 items-center">
                  {businessData?.business_email ? (
                    <Link
                      className="flex gap-2 items-center"
                      href={`mailto:${businessData?.business_email}`}
                    >
                      <IoMailOutline size={24} />
                      <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">
                        Email
                      </p>
                    </Link>
                  ) : null}
                  {businessData?.business_website ? (
                    <Link
                      target="_blank"
                      className="flex gap-2 items-center"
                      href={`${businessData?.business_website}`}
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
                  type="business"
                  id={businessData?.business_id}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  handleShowUserAdmins={handleShowAdminUsers}
                />
              </div>
              <div className="flex flex-col gap-4 md:col-span-5">
                {showAdminUsers ? (
                  <AdminUserList
                    type="business"
                    entityId={businessData?.business_id}
                    entityName={businessData?.business_name}
                    owner={owner}
                    handleShowUserAdmins={handleShowAdminUsers}
                  />
                ) : (
                  <>
                    <div className="flex gap-4 items-center justify-between">
                      <h2 className="font-semibold text-lg">
                        {businessData?.business_name} Posts
                      </h2>
                      {owner ? (
                        <NewPostIcon
                          type={"business"}
                          id={businessData?.business_id}
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
                        <p>This business hasn&apos;t posted yet.</p>
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
              <h2 className="font-bold text-xl">Edit your business</h2>
              <EditGroupForm
                type="business"
                entityID={businessData?.business_id}
                propData={businessData}
                setShowForm={setShowForm}
                showForm={showForm}
              />
            </FormDrawer>
            <PersonalNav />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
