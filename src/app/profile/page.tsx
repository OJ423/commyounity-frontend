"use client"

import { useAuth } from "@/components/context/AuthContext";
import ProfilePagesNav from "@/components/ProfilePagesNav";
import UploadAvatar from "@/components/UploadAvatar";
import { formatDate } from "@/utils/dataTransformers";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  const { user } = useAuth()
  let joinDate;
  if ( user ) {joinDate = formatDate(user.date_joined)}

  const handleEditProfile = () => {
    alert("Placeholder to handle profile edit")
  }

  return (
    <>
    <main className="flex min-h-screen flex items-center">
      {user ? 
      <>
      <ProfilePagesNav />
      <section className="px-4 py-16 md:p-8 lg:p-16 w-full">
        <h1 className="font-bold text-2xl md:text-3xl pb-8 mb-8 border-b border-gray-300">{`Here's your profile ${user.username}`}</h1>
        <div className="flex gap-4 md:gap-8 lg:gap-16 items-center mb-8 pb-8 border-b border-gray-300">
          <div>
            <p className="text-sm font-medium mb-4">
              Profile Pic:
            </p>
            <div className="w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] xl:w-[400px] xl:h-[400px] relative">
              {user.user_avatar ?
              <Image 
                src={user.user_avatar}
                alt={`${user.username} profile pic`}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-xl"
              />
              :
              <Image 
                src='/blank_user_avatar.png'
                alt={`${user.username} profile pic`}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-xl"
              />
              }
              <UploadAvatar />
            </div>
          </div>
          <div className="flex flex-col gap-4 items-start">
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">
                Username:
              </p>
              <p className="text-lg font-semibold text-indigo-500">
                {user.username}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">
                Email:
              </p>
              <p className="text-xs md:text-lg font-semibold text-indigo-500">
                {user.email}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">
                Date Joined:
              </p>
              <p className="text-lg font-semibold text-indigo-500">
                {joinDate}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start mb-8 pb-8 border-b border-gray-300">
          <p className="text-sm font-medium mb-8">
            Your bio:
          </p>
          <p className="text-lg font-light p-8 rounded border border-gray-300 w-full">
            {user.user_bio ? user.user_bio : "Write a little about yourself to get to know other comm-YOU-nity members"}
          </p>
        </div>
        <div className="flex justify-between items-center gap-4 mb-20 md:mb-0">
          <div className="flex gap-2 items-center">
            <Link href="" onClick={handleEditProfile}
            className="text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
            >
              <span>Edit</span>
            </Link>
            <Link href="" onClick={handleEditProfile}
            className="text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
            >
              <span>Change Password</span>
            </Link>
          </div>
          <Link href="" onClick={handleEditProfile}
            className="text-xs w-max border-solid border-4 border-rose-600 text-rose-600 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out"
          >
            <span>Delete</span>
          </Link>

        </div>
      </section>
      </>
      : <p>You need to be signed in to see your profile</p>
      }
    </main>    
    </>
  )
}