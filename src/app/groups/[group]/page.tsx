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
import { getGroupById } from "@/utils/apiCalls";
import { GroupData, PostData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupPage() {
  const params = useParams<{ group: string }>();

  const [groupData, setGroupData] = useState<GroupData>();
  const [postData, setPostData] = useState<PostData[] | []>([]);
  const [fetchPosts, setFetchPosts] = useState<boolean>(false);
  const [member, setMember] = useState<boolean>(false);
  const [owner, setOwner] = useState<boolean>(false);
  const [authErr, setAuthErr] = useState<boolean>(false);

  const { userMemberships, setToken, token } = useAuth();

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
        const data = await getGroupById(params.group, localToken);
        setGroupData(data.group);
        setPostData(data.posts);
        setToken(data.token);
        if (userMemberships) {
          const memberCheck = userMemberships?.userMemberships?.groups.some(
            (g) => g.group_id === data.group.group_id
          );
          if (memberCheck) {
            setMember(true);
          }
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.msg;

        if (
          errorMessage === "Authorization header missing" ||
          errorMessage === "Invalid or expired token"
        ) {
          setAuthErr(true);
        } else {
          console.log(error);
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
              href="/groups"
            >{`<< Back to Groups`}</Link>
            <section className="grid grid-cols-1 gap-16 md:grid-cols-8 md:gap-20 justify-start">
              <div className="flex flex-col gap-4 text-left justify-start items-start md:col-span-3">
                <h1 className="font-semibold text-xl md:text-2xl">
                  {groupData?.group_name}
                </h1>
                <div className="w-full h-60 relative">
                  {groupData?.group_img ? (
                    <Image
                      src={groupData.group_img}
                      width={200}
                      height={100}
                      quality={60}
                      priority
                      alt={`${groupData?.group_name} profile picture`}
                      className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                    />
                  ) : (
                    <Image
                      src="/placeholder-image.webp"
                      width={200}
                      height={100}
                      quality={60}
                      priority
                      alt={`${groupData?.group_name} profile picture`}
                      className="w-full h-60 object-cover rounded mb-4 shadow-xl"
                    />
                  )}
                  <>
                    {owner ? (
                      <EditHeaderImage type="group" id={groupData?.group_id} />
                    ) : null}
                  </>
                </div>
                <p>{groupData?.group_bio}</p>
                <MembershipButtonLogic
                  member={member}
                  setMember={setMember}
                  owner={owner}
                  setOwner={setOwner}
                  type="group"
                  id={groupData?.group_id}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  handleShowUserAdmins={handleShowAdminUsers}
                />
              </div>
              <div className="flex flex-col gap-4 md:col-span-5">
                {showAdminUsers ? (
                  <AdminUserList
                    type="group"
                    entityId={groupData?.group_id}
                    entityName={groupData?.group_name}
                    owner={owner}
                    handleShowUserAdmins={handleShowAdminUsers}
                  />
                ) : (
                  <>
                    <div className="flex gap-4 items-center justify-between">
                      <h2 className="font-semibold text-lg">
                        {groupData?.group_name} Posts
                      </h2>
                      {member || owner ? (
                        <NewPostIcon
                          type={"group"}
                          id={groupData?.group_id}
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
                        <>
                          <p>This group hasn&apos;t posted yet.</p>
                        </>
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
                type="group"
                entityID={groupData?.group_id}
                propData={groupData}
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
