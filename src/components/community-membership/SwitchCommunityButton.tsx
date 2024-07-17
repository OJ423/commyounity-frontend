"use client"

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { getUserAdmins, getUserMemberships } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";

interface SwitchProps {
  community_id: string | null,
  community_name: string,
  communityMember: boolean
}

const SwitchCommunityButton:React.FC<SwitchProps> = ({community_id, community_name, communityMember}) => {
  const { user, token, setSelectedCommunity, setUserMemberships, setUserAdmins, setUserPostLikes, setUser, setToken, setCommunities } = useAuth()

  const router = useRouter()

  async function setMemberships(user_id: number | undefined, communityId:number) {
    try{
      if (user) {
        const memberships = await getUserMemberships(user_id, communityId, token);
        setUserMemberships(memberships);
        localStorage.setItem('userMemberships', JSON.stringify(memberships));
      }
    } catch(error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log(error.response.data.msg)
    }
  }

  async function setAdmins(user_id: number | undefined, communityId:number) {
    try{
      if (user) {
        const admins = await getUserAdmins(user_id, communityId, token);
        setUserAdmins(admins);
        localStorage.setItem('userAdmins', JSON.stringify(admins));
      }
    } catch(error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log(error.response.data.msg)
    }
  }


  async function handleSwitchCommunity() {
    try {
      if (community_id && communityMember) {
        const chosenCommunity = {community_id: +community_id, community_name }
        setSelectedCommunity(chosenCommunity)
        if(user) {
          setMemberships(+user?.user_id, +community_id);
          setAdmins(+user?.user_id, +community_id)
        }
        localStorage.setItem('selectedCommunity', JSON.stringify(chosenCommunity));
      }
    } catch(error:any) {
      console.log(error)
    }
  }

  const invalidTokenResponse = () :void => {
    LogUserOut({setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes})
    router.push('/login')
  }


  return (
    <Link
      href=""
      onClick={handleSwitchCommunity}
      className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
    >
      <span>Jump In</span>
    </Link>
  );
};

export default SwitchCommunityButton