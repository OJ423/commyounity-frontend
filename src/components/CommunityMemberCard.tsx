import { Community, Members } from "@/utils/customTypes";

interface CommunityMemberCardProps {
  member: Members;
  community: Community
}

const CommunityMemberCard: React.FC<CommunityMemberCardProps> = ({member, community}) => {
  return(
    <section className="p-4 rounded-lg bg-indigo-100 flex gap-8 lg:gap-20 items-center justify-between">
      <div className="flex flex-col gap-2">
        <p className="font-bold">{member.username}</p>
        <p className="font-light text-sm">{member.user_bio}</p>
      </div>
      <button
        className="text-xs w-max border-solid border-4 border-black py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"  
      >
        Remove
      </button>
    </section>
  )
}

export default CommunityMemberCard