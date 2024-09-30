"use client";

import { useAuth } from "../context/AuthContext";
import { getUserAdmins, getUserMemberships, joinUser } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";
import { JoinedCommunityResponse } from "@/utils/customTypes";

interface JoinProps {
  community_id: string | null;
  setCommunityMember: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinCommBtn: React.FC<JoinProps> = ({
  community_id,
  setCommunityMember,
}) => {
  const {
    user,
    token,
    communities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUser,
    setToken,
    setCommunities,
    setUserPostLikes
  } = useAuth();

  const router = useRouter();

  async function setMemberships(
    communityId: string
  ) {
    try {
      if (user) {
        const memberships = await getUserMemberships(
          communityId,
          token
        );
        setUserMemberships(memberships);
        localStorage.setItem("userMemberships", JSON.stringify(memberships));
        setToken(memberships.token)
        localStorage.setItem("token", memberships.token)
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error.response.data.msg);
    }
  }

  async function setAdmins(communityId: string) {
    try {
      if (user) {
        const admins = await getUserAdmins(communityId, token);
        setUserAdmins(admins);
        localStorage.setItem("userAdmins", JSON.stringify(admins));
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error.response.data.msg);
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
    });
    router.push("/login");
  };

  async function handleJoin() {
    try {
      if (community_id && user) {
        const fetchData: JoinedCommunityResponse = await joinUser(
          user.user_id,
          community_id,
          "community",
          token
        );
        setSelectedCommunity(fetchData.community);
        setCommunityMember(true);
        setMemberships(community_id);
        setAdmins(community_id);
        setCommunities([...communities, fetchData.community]);
        setToken(fetchData.token)
        localStorage.setItem("token", fetchData.token)
        localStorage.setItem("communities", JSON.stringify(communities));
        localStorage.setItem(
          "selectedCommunity",
          JSON.stringify(fetchData.community)
        );
        const savedCommunityMembership: string | null =
          localStorage.getItem("communities");
        if (savedCommunityMembership) {
          const parsedCommunityMembers = JSON.parse(savedCommunityMembership);
          parsedCommunityMembers.push(fetchData.community);
          localStorage.setItem(
            "communities",
            JSON.stringify(parsedCommunityMembers)
          );
        }
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error.response.data.msg);
    }
  }

  return (
    <button
      onClick={handleJoin}
      className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
    >
      <span>Join</span>
    </button>
  );
};

export default JoinCommBtn;
