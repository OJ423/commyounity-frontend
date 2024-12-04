import { AdminsLists, Community, Members } from "@/utils/customTypes";
import CommunityMemberCard from "./CommunityMemberCard";
import { useAuth } from "./context/AuthContext";

interface CommunityMembersListProps {
  community: Community;
  owner:boolean;
  members: Members[] | [];
  admins: AdminsLists[] | [];
  invalidTokenResponse: () => void;
}


const CommunityMembersList: React.FC<CommunityMembersListProps> = ({community, owner, members, admins, invalidTokenResponse}) => {
  
  const {user} = useAuth()

  return(
    <>
     {owner ?
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">Members of {community.community_name}</h2>
        <p>Here are the members of the community.</p>
        <div className="flex flex-col gap-4">
          {members.map((member) => (
            member.user_id === Number(user?.user_id) ?
            null
            :
            <CommunityMemberCard
              key={member.user_id}
              community={community}
              member={member}
              admins={admins}
              invalidTokenResponse={invalidTokenResponse}
            />
          ))}
        </div>
      </section>
     : null
      }
    </>
  )
}

export default CommunityMembersList