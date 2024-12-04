import { AdminsLists, Community, Members } from "@/utils/customTypes";
import { useAuth } from "./context/AuthContext";
import CommunityAdminCard from "./CommunityAdminCard";

interface CommunityAdminListProps {
  community: Community;
  owner:boolean;
  admins: AdminsLists[] | [];
  invalidTokenResponse: () => void;
}


const CommunityAdminList: React.FC<CommunityAdminListProps> = ({community, owner, admins, invalidTokenResponse}) => {
  
  const {user} = useAuth();
  
  return(
    <>
     {owner ?
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">Administrators of {community.community_name}</h2>
        <p>Here are the admin users of the community.</p>
        <div className="flex flex-col gap-4">
          {admins.length ?
          <>
          {admins.map((admin) => (
            admin.user_id === Number(user?.user_id) ?
            null
            :
            <CommunityAdminCard
              key={admin.user_id}
              community={community}
              admin={admin}
              invalidTokenResponse={invalidTokenResponse}
            />
          ))}
          </>
          : <p>There are no administrators other than yourself.</p>}
        </div>
      </section>
     : null
      }
    </>
  )
}

export default CommunityAdminList