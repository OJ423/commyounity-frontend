"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import FormDrawer from "@/components/FormDrawer";
import Header from "@/components/Header";
import ProfileEditForm from "@/components/ProfileEditForm";
import ProfilePagesNav from "@/components/ProfilePagesNav";
import UploadAvatar from "@/components/UploadAvatar";
import { deleteUser } from "@/utils/apiCalls";
import { formatDate } from "@/utils/dataTransformers";
import { LogUserOut } from "@/utils/logOut";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Profile() {
  const {
    user,
    token,
    setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setAdminCommunities
  } = useAuth();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [deleteCheck, setDeleteCheck] = useState<boolean>(false);

  const router = useRouter();

  const handleDisplayForm = () => {
    setShowForm(!showForm);
  };

  const handleDeleteCheck = () => {
    setDeleteCheck(!deleteCheck);
  };

  const handleDeleteProfile = async () => {
    try {
      const data = await deleteUser(user?.user_id, token);
      LogUserOut({
        setToken,
        setUser,
        setCommunities,
        setSelectedCommunity,
        setUserMemberships,
        setUserAdmins,
        setUserPostLikes,
        setAdminCommunities
      });
      router.push("/");
    } catch (error: any) {
      if (error)
        LogUserOut({
          setToken,
          setUser,
          setCommunities,
          setSelectedCommunity,
          setUserMemberships,
          setUserAdmins,
          setUserPostLikes,
          setAdminCommunities
        });
      router.push("/login");
    }
  };

  return (
    <>
      {user ? (
        <main className="flex min-h-screen flex items-center">
          <>
            <ProfilePagesNav />
            <section className="px-4 py-8 md:p-8 lg:p-16 w-full">
              <h1 className="font-bold text-2xl md:text-3xl pb-8 mb-8 border-b border-gray-300">{`Here's your profile ${user.username}`}</h1>
              <div className="flex gap-4 md:gap-8 lg:gap-16 items-center mb-8 pb-8 border-b border-gray-300">
                <div>
                {user.user_avatar ?
                  <p className="text-sm font-medium mb-4">Profile Pic:</p>
                  : 
                  <p className="text-sm font-medium mb-4 text-green-600">Add a profile picture for your posts and comments</p>
                }
                  <div className="w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] relative">
                    {user.user_avatar ? (
                      <Image
                        src={user.user_avatar}
                        alt={`${user.username} profile pic`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Image
                        src="/blank_user_avatar.png"
                        alt={`${user.username} profile pic`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}
                    <UploadAvatar />
                  </div>
                </div>
                <div className="flex flex-col gap-4 items-start">
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-medium">Username:</p>
                    <p className="text-lg font-semibold text-indigo-500">
                      {user.username}
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-medium">Email:</p>
                    <p className="text-xs md:text-lg font-semibold text-indigo-500">
                      {user.user_email}
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-medium">Date Joined:</p>
                    <p className="text-lg font-semibold text-indigo-500">
                      {formatDate(user.date_joined)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start mb-8 pb-8 border-b border-gray-300">
                <p className="text-sm font-medium mb-8">Your bio:</p>
                <p className={`${user.user_bio ? "font-light" : "text-green-600 font-bold"} text-lg p-8 rounded border border-gray-300 w-full`}>
                  {user.user_bio
                    ? user.user_bio
                    : "Write a little about yourself to get to know other comm-YOU-nity members"}
                </p>
              </div>
              <div className="flex justify-between items-center gap-4 mb-20 md:mb-0">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={handleDisplayForm}
                    className="text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                  >
                    <span>Edit</span>
                  </button>
                </div>
                {deleteCheck ? (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleDeleteProfile}
                      className="text-xs w-max border-solid border-4 border-rose-600 text-rose-600 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out"
                    >
                      <span>Confirm</span>
                    </button>
                    <button
                      onClick={handleDeleteCheck}
                      className="text-xs w-max border-solid border-4 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleDeleteCheck}
                    className="text-xs w-max border-solid border-4 border-rose-600 text-rose-600 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out"
                  >
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </section>
            <FormDrawer
              setShowForm={setShowForm}
              showForm={showForm}
              handleDisplayForm={handleDisplayForm}
            >
              <ProfileEditForm showForm={showForm} setShowForm={setShowForm} />
            </FormDrawer>
          </>
        </main>
      ) : (
        <>
          <Header />
          <div className="flex justify-center items-center w-full my-20">
            <p>You need to be signed in to see your profile</p>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
