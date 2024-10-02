"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { getUserAdmins, getUserMemberships } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";

interface SwitchProps {
  community_id: string | null;
  community_name: string;
  communityMember: boolean;
}

const SwitchCommunityButton: React.FC<SwitchProps> = ({
  community_id,
  community_name,
  communityMember,
}) => {
  
  const {
    user,
    token,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setUser,
    setToken,
    setCommunities,
    setAdminCommunities
  } = useAuth();

  const router = useRouter();

  async function setMemberships(communityId: string) {
    try {
      if (user && token) {
        const memberships = await getUserMemberships(communityId, token);
        setUserMemberships(memberships);
        localStorage.setItem("userMemberships", JSON.stringify(memberships));
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        // invalidTokenResponse()
      }
      console.log(error.response.data.msg);
    }
  }

  async function setAdmins(communityId: string) {
    try {
      if (user && token) {
        const admins = await getUserAdmins(communityId, token);
        setUserAdmins(admins);
        localStorage.setItem("userAdmins", JSON.stringify(admins));
        setToken(admins.token);
        localStorage.setItem("token", admins.token);
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        // invalidTokenResponse()
      }
      console.log(error.response.data.msg);
    }
  }

  async function handleSwitchCommunity() {
    try {
      if (community_id && communityMember) {
        const chosenCommunity = { community_id: +community_id, community_name };
        setSelectedCommunity(chosenCommunity);
        if (user) {
          setMemberships(community_id);
          setAdmins(community_id);
        }
        localStorage.setItem(
          "selectedCommunity",
          JSON.stringify(chosenCommunity)
        );
        const transformedCommName = community_name
          .replace(/ /g, "-")
          .toLowerCase();
        router.push(
          `/communities/${transformedCommName}?community=${community_id}`
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  }

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

  return (
    <button
      onClick={handleSwitchCommunity}
      className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
    >
      <span>Jump In</span>
    </button>
  );
};

export default SwitchCommunityButton;
