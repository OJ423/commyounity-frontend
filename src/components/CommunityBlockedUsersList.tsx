import { BlockedUser, Community, Members } from "@/utils/customTypes";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { getBlockedUsers, getCommunityMembers } from "@/utils/apiCalls";
import CommunityMemberCard from "./CommunityMemberCard";
import CommunityBlockedUserCard from "./CommunityBlockedUserCard";

interface CommunityBlockedUsersListProps {
  community: Community;
  owner:boolean;
  invalidTokenResponse: () => void;
}


const CommunityBlockedUsersList: React.FC<CommunityBlockedUsersListProps> = ({community, owner, invalidTokenResponse}) => {
  
  const {token, setToken} = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[] | []>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBlockedUsers(community.community_id, token);
        setToken(data.token);
        localStorage.setItem("token", data.token)
        setBlockedUsers(data.blockedUsers)
      }
      catch(error:any) {
        console.log("There has been an error fetching the community members", error);
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          invalidTokenResponse()
        }
      }
    }
    fetchData()
  },[token, community])
  
  return(
    <section className="flex flex-col gap-4">
      <h2 className="font-bold text-xl">Members of {community.community_name}</h2>
      <p>Here are the members of the community.</p>
      <div className="flex flex-col gap-4">
        {blockedUsers.map((blockedUser) => (
          <CommunityBlockedUserCard
            key={blockedUser.blocked_user_id}
            community={community}
            blockedUser={blockedUser}
            invalidTokenResponse={invalidTokenResponse}
          />
        ))}
      </div>
    </section>
  )
}

export default CommunityBlockedUsersList