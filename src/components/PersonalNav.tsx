"use client"

import { useEffect, useState } from "react";
import { FiChevronsUp, FiChevronsDown, FiUser, FiList } from "react-icons/fi";
import { RiTimelineView, RiAdminLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";



export default function PersonalNav() {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const { selectedCommunity, userMemberships, userAdmins } = useAuth()
  const [adminExists, setAdminExists] = useState<boolean>(false);
  const [membershipsExist, setMemebershipsExist] = useState<boolean>(false);

  const handleDisplayMenu = () => {
    setDisplayMenu(!displayMenu)
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
        setMemebershipsExist(true);
      }
    }
  }, [userAdmins, userMemberships]);

  return(
    <>
    {selectedCommunity ?
    <section className={`${!displayMenu ? "translate-y-[100%]" : "translate-y-[0%]" } fixed w-full p-4 bottom-0 left-0 bg-indigo-100 shadow-2xl transition-all duration-500 ease-in ease-out`}>
      <div onClick={handleDisplayMenu} className="sticky flex gap-1 items-center w-max -mt-24 p-2 bg-white hover:bg-indigo-200 transition-all duration-500 rounded shadow-xl cursor-pointer">
        {!displayMenu ?
          <FiChevronsUp size={32} />
          :
          <FiChevronsDown size={32} />
        }
        <FiUser size={32} />
      </div>


      <article className="flex gap-2 items-start mt-12 justify-center sm:justify-between">
        <div className="flex gap-2 md:gap-8 lg:gap-16 items-start">
          <div className="hidden sm:block">
            <p className="text-xs md:text-auto font-medium">
              Current Community: 
            </p>
            <p className="text-xs md:text-auto font-bold text-indigo-500">{selectedCommunity?.community_name}
            </p>
          </div>
          <Link href="/timeline">
            <div className="flex flex-col gap-4 items-center p-4 rounded cursor-pointer hover:bg-white transition-all duration-500">
              <RiTimelineView size={42} className="p-1 rounded" />
              <p className="text-xs font-light text-center">
                Timeline
              </p>
            </div>
          </Link>
          {membershipsExist ?
          <Link href="/profile/memberships">
            <div className="flex flex-col gap-4 items-center p-4 rounded cursor-pointer hover:bg-white transition-all duration-500">
            <GrGroup size={42} className="p-1 rounded" />
              <p className="text-xs font-light text-center">
                Memberships
              </p>
            </div>
          </Link>
          : null
          }
          { adminExists ? 
          <Link href="/profile/admin">
            <div className="flex flex-col gap-4 items-center p-4 rounded cursor-pointer hover:bg-white transition-all duration-500">
            <RiAdminLine size={42} className="p-1 rounded" />
              <p className="text-xs font-light text-center">
                Things You Manage
              </p>
            </div>
          </Link>
          : null
          }
          <Link href="/profile">
            <div className="flex flex-col gap-4 items-center p-4 rounded cursor-pointer hover:bg-white transition-all duration-500">
            <CgProfile size={42} className="p-1 rounded" />
              <p className="text-xs font-light text-center">
                Profile
              </p>
            </div>
          </Link>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-bold text-right">
            Your Comm-YOU-nity...
          </p>
          <p className="text-xs font-light text-right">
            Find everything <span className="font-medium">you</span>
          </p>
        </div>
      </article>
    </section>
    : null
    }
    </>
  )
}