"use client"

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { leaveUser } from "@/utils/apiCalls";
import { CommunitiesLocalStorage } from "@/utils/customTypes";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";


interface LeaveCommButtonProps {
  community_id: string | null,
  setCommunityMember: React.Dispatch<React.SetStateAction<boolean>>
}

const LeaveCommButton:React.FC<LeaveCommButtonProps> = ({community_id, setCommunityMember}) => {
const { user, communities, token, setSelectedCommunity, setCommunities, setToken, setUser, setUserMemberships, setUserAdmins, setUserPostLikes } = useAuth()

const router = useRouter()

  async function handleLeave() {
    try {
      if (community_id && user) {
        const deleteCall = await leaveUser(user.user_id, community_id, "community", token);
        setSelectedCommunity(null);
        setCommunityMember(false)
        setCommunities(
          communities.filter(c => String(c.community_id) !== community_id)
        )
        localStorage.setItem('communities', JSON.stringify(communities))
        const savedCommunityMembership: string | null = localStorage.getItem('communities')
        if (savedCommunityMembership) {
          const parsedCommunityMembers: CommunitiesLocalStorage[] = JSON.parse(savedCommunityMembership)
          const updatedCommunities:CommunitiesLocalStorage[] = parsedCommunityMembers.filter(c => String(c.community_id) !== community_id)
          localStorage.setItem('communities', JSON.stringify(updatedCommunities))
        }
      }
    } catch (error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        LogUserOut({setToken,
          setUser,
          setCommunities,
          setSelectedCommunity,
          setUserMemberships,
          setUserAdmins,
          setUserPostLikes,
        })
        router.push('/login')
      }
      console.log(error.response.data.msg)
    }
  }

  return (
    <Link
      href=""
      onClick={handleLeave}
      className="text-xs border-solid border-4 border-rose-600 text-rose-600 py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out"
    >
      <span>Leave</span>
    </Link>
  );
}

export default LeaveCommButton
