"use client";

import {
  IoHomeOutline,
  IoStorefrontOutline,
  IoSchoolOutline,
  IoWalkOutline,
} from "react-icons/io5";
import { MdOutlineChurch } from "react-icons/md";
import { useAuth } from "./context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { LogUserOut } from "@/utils/logOut";

export default function Footer() {
  const {
    user,
    selectedCommunity,
    setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setAdminCommunities,
  } = useAuth();

  const handleLogOut = () => {
    LogUserOut(
      {setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
      setAdminCommunities}
    );
  };

  return (
    <footer className="w-screen pt-20 bg-gray-200 flex flex-col items-center justify-center">
      <section className="box-sizing grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 px-8 md:px-24 items-center">
        <div className="mx-auto">
          <h2 className="font-bold text-2xl mb-4">Comm<span className="text-indigo-500">you</span>nity</h2>
          <p className="font-light">
            Connecting all that is good in the community without using your
            data.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/communities">
            <div className="flex flex-col gap-4 items-center hover:opacity-50 cursor-pointer transition duration-500">
              <IoHomeOutline size={25} />
              <p className="text-xs font-light">Communities</p>
            </div>
          </Link>
          {selectedCommunity ? (
            <>
              <Link href="/businesses">
                <div className="flex flex-col gap-4 items-center hover:opacity-50 cursor-pointer transition duration-500">
                  <IoStorefrontOutline size={25} />
                  <p className="text-xs font-light">Businesses</p>
                </div>
              </Link>
              <Link href="/schools">
                <div className="flex flex-col gap-4 items-center hover:opacity-50 cursor-pointer transition duration-500">
                  <IoSchoolOutline size={25} />
                  <p className="text-xs font-light">Schools</p>
                </div>
              </Link>
              <Link href="/groups">
                <div className="flex flex-col gap-4 items-center hover:opacity-50 cursor-pointer transition duration-500">
                  <IoWalkOutline size={25} />
                  <p className="text-xs font-light">Groups</p>
                </div>
              </Link>
              <Link href="/churches">
                <div className="flex flex-col gap-4 items-center hover:opacity-50 cursor-pointer transition duration-500">
                  <MdOutlineChurch size={25} />
                  <p className="text-xs font-light">Churches</p>
                </div>
              </Link>
            </>
          ) : null}
        </div>
        <div>
          {user ? (
            <>
              <h2 className="font-bold text-xl">Hey {user.username}</h2>
              {selectedCommunity ? (
                <p>You&apos;re in {selectedCommunity.community_name} </p>
              ) : null}
            </>
          ) : (
            <Link href="/login">
              <p className="font-medium hover:opacity-50 cursor-pointer transition-all duration-500 text-center">
                Login / Register
              </p>
            </Link>
          )}
        </div>
        {user ? (
          <div>
            <Link href="/profile">
              <p className="font-medium hover:opacity-50 cursor-pointer transition-all duration-500">
                Profile
              </p>
            </Link>
            <Link href="/timeline">
              <p className="font-medium hover:opacity-50 cursor-pointer transition-all duration-500">
                Community Timeline
              </p>
            </Link>
            <p onClick={handleLogOut} className="font-medium hover:opacity-50 cursor-pointer transition-all duration-500">
              Logout
            </p>
          </div>
        ) : (
          <Link href="/">
            <Image
              src="/Commyounity.svg"
              alt="Commyounity Logo"
              className="w-40 md:w-60 mx-auto"
              width={250}
              height={12}
              priority
              style={{ height: "auto" }}
            />
          </Link>
        )}
      </section>
      <section className="mt-20 py-8 bg-gray-300 flex items-center justify-center w-[100%] box-sizing">
        <p className="font-bold text-sm">
          © {new Date().getFullYear()} Copyright: Commyounity
        </p>
      </section>
    </footer>
  );
}
