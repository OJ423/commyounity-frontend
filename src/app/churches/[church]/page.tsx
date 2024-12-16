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
import { getChurchById } from "@/utils/apiCalls";
import { ChurchData, PostData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMailOutline, IoArrowRedoOutline } from "react-icons/io5";

export default function ChurchPage() {
  const params = useParams<{ church: string }>();

  const [churchData, setChurchData] = useState<ChurchData>();
  const [postData, setPostData] = useState<PostData[] | []>([]);
  const [fetchPosts, setFetchPosts] = useState<boolean>(false);
  const [member, setMember] = useState<boolean>(false);
  const [owner, setOwner] = useState<boolean>(false);
  const { userMemberships, setToken, token } = useAuth();
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
        const data = await getChurchById(params.church, localToken);
        setChurchData(data.church);
        setPostData(data.posts);
        setToken(data.token);
        localStorage.setItem("token", data.token)
        if (userMemberships) {
          const memberCheck = userMemberships?.userMemberships?.churches.some(
            (c) => c.church_id === data.church.church_id
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
  }, [userMemberships, params, fetchPosts, setToken, token]);

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
              href="/churches"
            >{`<< Back to Churches`}</Link>

            <section className="grid grid-cols-1 gap-16 md:grid-cols-8 md:gap-20 justify-start">
              <div className="flex flex-col gap-4 text-left justify-start items-start md:col-span-3">
                <h1 className="font-semibold text-xl md:text-2xl">
                  {churchData?.church_name}
                </h1>
                <div className="w-full h-60 relative">
                  {churchData?.church_img ? (
                    <Image
                      src={churchData.church_img}
                      width={200}
                      height={100}
                      quality={60}
                      priority
                      alt={`${churchData?.church_name} profile picture`}
                      className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                    />
                  ) : (
                    <Image
                      src="/placeholder-image.webp"
                      width={200}
                      height={100}
                      quality={60}
                      priority
                      alt={`${churchData?.church_name} profile picture`}
                      className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                    />
                  )}
                  <>
                    {owner ? (
                      <EditHeaderImage
                        type="church"
                        id={churchData?.church_id}
                      />
                    ) : null}
                  </>
                </div>
                <p>{churchData?.church_bio}</p>
                <div className="flex justify-between w-full flex-wrap gap-1 items-center">
                  {churchData?.church_email ? (
                    <Link
                      className="flex gap-2 items-center"
                      href={`mailto:${churchData?.church_email}`}
                    >
                      <IoMailOutline size={24} />
                      <p className="text-sm font-medium text-indigo-600 hover:text-indigo-400 transition-all duration-300">
                        Email
                      </p>
                    </Link>
                  ) : null}
                  {churchData?.church_website ? (
                    <Link
                      target="_blank"
                      className="flex gap-2 items-center"
                      href={`${churchData?.church_website}`}
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
                  type="church"
                  id={churchData?.church_id}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  handleShowUserAdmins={handleShowAdminUsers}
                />
              </div>
              <div className="flex flex-col gap-4 md:col-span-5">
                {showAdminUsers ? (
                  <AdminUserList
                    type="church"
                    entityId={churchData?.church_id}
                    entityName={churchData?.church_name}
                    owner={owner}
                    handleShowUserAdmins={handleShowAdminUsers}
                  />
                ) : (
                  <>
                    <div className="flex gap-4 items-center justify-between">
                      <h2 className="font-semibold text-lg">
                        {churchData?.church_name} Posts
                      </h2>
                      {member || owner ? (
                        <NewPostIcon
                          type={"church"}
                          id={churchData?.church_id}
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
                        <p>This church hasn&apos;t posted yet.</p>
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
              <h2 className="font-bold text-xl">Edit your church</h2>
              <EditGroupForm
                type="church"
                entityID={churchData?.church_id}
                propData={churchData}
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
