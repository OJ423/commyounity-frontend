"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiHome,
  FiActivity,
  FiUser,
  FiUsers,
  FiSettings,
  FiMapPin,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "./context/AuthContext";
import Image from "next/image";
import { LogUserOut } from "@/utils/logOut";

export default function ProfilePagesNav() {
  const pathname = usePathname();
  const {
    userAdmins,
    selectedCommunity,
    userMemberships,
    setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserAdmins,
    setUserMemberships,
    setUserPostLikes,
    setAdminCommunities
  } = useAuth();
  const [adminExists, setAdminExists] = useState<boolean>(false);
  const [membershipsExist, setMembershipsExist] = useState<boolean>(false);

  const router = useRouter();

  function handleLogout():void {
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
    router.push('/login');
  }

  useEffect(() => {
    if (userAdmins) {
      if (
        userAdmins.schools.length > 0 ||
        userAdmins.businesses.length > 0 ||
        userAdmins.churches.length > 0 ||
        userAdmins.groups.length
      ) {
        setAdminExists(true);
      }
    }
    if (userMemberships) {
      if (
        userMemberships.userMemberships.schools.length > 0 ||
        userMemberships.userMemberships.businesses.length > 0 ||
        userMemberships.userMemberships.churches.length > 0 ||
        userMemberships.userMemberships.groups.length
      ) {
        setMembershipsExist(true);
      }
    }
  }, [userAdmins, userMemberships]);

  return (
    <>
      <section className="w-full fixed bottom-0 left-0 px-4 py-8 bg-white shadow-2xl md:sticky md:w-auto md:min-w-max md:min-h-[100vh] md:flex md:items-center block md:px-8 lg:px-16 md:py-8 md:left-0 md:top-0">
        <div className="flex gap-4 items-center justify-center md:hidden">
          <Link href="/profile">
            <FiUser
              aria-label="Profile page"
              size={24}
              className={`${
                pathname === "/profile" ? "text-indigo-600" : "text-auto"
              } hover:opacity-50 cursor-pointer transition-all duration-500`}
            />
          </Link>
          {selectedCommunity ? (
            <>
              {membershipsExist ? (
                <Link href="/profile/memberships">
                  <FiUsers
                    aria-label={`Your memberships in ${selectedCommunity.community_name}`} 
                    size={24}
                    className={`${
                      pathname.includes("/profile/memberships")
                        ? "text-indigo-600"
                        : "text-auto"
                    } hover:opacity-50 cursor-pointer transition-all duration-500`}
                  />
                </Link>
              ) : null}
              <>
                {adminExists ? (
                  <Link href="/profile/admin">
                    <FiSettings
                     aria-label={`Groups and things you manage in ${selectedCommunity.community_name}`}
                      size={24}
                      className={`${
                        pathname.includes("/profile/admin")
                          ? "text-indigo-600"
                          : "text-auto"
                      } hover:opacity-50 cursor-pointer transition-all duration-500`}
                    />
                  </Link>
                ) : null}
                <Link href="/timeline">
                  <FiActivity
                    aria-label={`See latest posts for groups and things you are a member of in ${selectedCommunity.community_name}`}
                    size={24}
                    className={`hover:opacity-50 cursor-pointer transition-all duration-500`}
                  />
                </Link>
              </>
            </>
          ) : null}
          <Link href="/profile/communities">
            <FiMapPin
              aria-label="Choose a community to engage with"
              size={24}
              className={`${
                pathname.includes("/profile/communities")
                  ? "text-indigo-600"
                  : "text-auto"
              } hover:opacity-50 cursor-pointer transition-all duration-500`}
            />
          </Link>
          <Link href="" onClick={handleLogout}>
            <FiLogOut
              aria-label="Logout of community"
              size={24}
              className={`hover:opacity-50 cursor-pointer transition-all duration-500`}
            />
          </Link>
        </div>
        <div className="hidden md:flex md:flex-col md:h-full md:w-full md:items-start md:justify-center md:gap-2">
          <Link href="/">
            <Image
              src="/Commyounity.svg"
              alt="Commyounity Logo"
              className="w-40 md:w-60"
              width={250}
              height={12}
              priority
              style={{ height: "auto" }}
            />
          </Link>
          {selectedCommunity ? (
            <p className="text-sm font-semibold text-gray-400 mb-16">
              You&apos;re logged into {selectedCommunity.community_name}
            </p>
          ) : null}
          <Link href="/profile">
            <div
              className={`${
                pathname === "/profile" ? "text-indigo-500" : "text-auto"
              } list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}
            >
              <FiUser size={24} />
              <p>Profile</p>
            </div>
          </Link>
          {selectedCommunity ? (
            <>
              {membershipsExist ? (
                <Link href="/profile/memberships">
                  <div
                    className={`${
                      pathname.includes("/profile/memberships")
                        ? "text-indigo-500"
                        : "text-auto"
                    } list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}
                  >
                    <FiUsers
                      size={24}
                      className={`${
                        pathname.includes("/profile/memberships")
                          ? "text-indigo-600"
                          : "text-auto"
                      } hover:opacity-50 cursor-pointer transition-all duration-500`}
                    />
                    <p>Your Memberships</p>
                  </div>
                </Link>
              ) : null}
              {adminExists ? (
                <Link href="/profile/admin">
                  <div
                    className={`${
                      pathname.includes("/profile/admin")
                        ? "text-indigo-500"
                        : "text-auto"
                    } list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}
                  >
                    <FiSettings
                      size={24}
                      className={`${
                        pathname.includes("/profile/admin")
                          ? "text-indigo-600"
                          : "text-auto"
                      } hover:opacity-50 cursor-pointer transition-all duration-500`}
                    />
                    <p>Admin</p>
                  </div>
                </Link>
              ) : null}
            </>
          ) : null}
          <Link href="/profile/communities">
            <div
              className={`${
                pathname.includes("/profile/communities")
                  ? "text-indigo-500"
                  : "text-auto"
              } list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}
            >
              <FiMapPin
                size={24}
                className={`${
                  pathname.includes("/profile/communities")
                    ? "text-indigo-600"
                    : "text-auto"
                } hover:opacity-50 cursor-pointer transition-all duration-500`}
              />
              <p>Your Communities</p>
            </div>
          </Link>
          <Link href="/timeline">
            <div
              className={`list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}
            >
              <FiActivity
                size={24}
                className={`hover:opacity-50 cursor-pointer transition-all duration-500`}
              />
              <p>Timeline</p>
            </div>
          </Link>
            <div onClick={handleLogout}
              className={`cursor-pointer list-style-none font-bold text-lg mb-4 flex gap-4 justify-start items-center cursor-pointer hover:text-gray-400 duration-500 ease-out transition-all`}
            >
              <FiLogOut
                size={24}
                className={`hover:opacity-50 cursor-pointer transition-all duration-500`}
              />
              <p>Logout</p>
            </div>
        </div>
      </section>
      <div className="fixed top-8 right-8 z-20 hover:opacity-50 transition-all duration-500">
        <Link href="/">
          <FiHome size={30} />
        </Link>
      </div>
    </>
  );
}
