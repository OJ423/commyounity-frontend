import { Community } from "@/utils/customTypes"
import Image from "next/image"

type ListProps = {
  community: Community
}

const CommunityCard: React.FC<ListProps> = ({community}) => {
  return(
    <section className="rounded bg-gray-200 pb-8 drop-shadow-xl">
      <Image 
        src={community.community_img}
        width={200}
        height={100}
        quality={60}
        alt={`${community.community_name} community image`}
        className="w-full h-60 object-cover rounded mb-4"
      />

      <h3 className="font-semibold px-2 text-lg pb-4">{community.community_name}</h3>
      
    
    </section>
  )
}

export default CommunityCard