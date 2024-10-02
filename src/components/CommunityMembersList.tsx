import { Community, Members } from "@/utils/customTypes";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { getCommunityMembers } from "@/utils/apiCalls";
import CommunityMemberCard from "./CommunityMemberCard";

interface CommunityMembersListProps {
  community: Community;
  owner:boolean;
  invalidTokenResponse: () => void;
}


const CommunityMembersList: React.FC<CommunityMembersListProps> = ({community, owner, invalidTokenResponse}) => {
  
  const {token, setToken} = useAuth();
  const [members, setMembers] = useState<Members[] | []>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCommunityMembers(token, community.community_id);
        setToken(data.token);
        localStorage.setItem("token", data.token)
        setMembers(data.members)
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
  },[])
  
  return(
    <section className="flex flex-col gap-4">
      <h2 className="font-bold text-xl">Members of {community.community_name}</h2>
      <p>Here are the members of the community.</p>
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <CommunityMemberCard
            community={community}
            member={member}
          />
        ))}
      </div>
    </section>
  )
}

export default CommunityMembersList