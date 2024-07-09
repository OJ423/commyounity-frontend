import { Community } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import {
  IoPeopleOutline,
  IoStorefrontOutline,
  IoSchoolOutline,
  IoWalkOutline,
} from "react-icons/io5";
import { MdOutlineChurch } from "react-icons/md";

type ListProps = {
  community: Community;
};

const CommunityCard: React.FC<ListProps> = ({ community }) => {
  return (
    <section className="rounded bg-gray-200 shadow-lg">
      <Image
        src={community.community_img}
        width={200}
        height={100}
        quality={60}
        priority
        alt={`${community.community_name} community image`}
        className="w-full h-60 object-cover rounded-t mb-4"
      />

      <h3 className="font-semibold px-2 text-lg pb-4">
        {community.community_name}
      </h3>
      <div className="flex gap-4 items-center justify-between px-2 pb-4">
        <div className="flex gap-2 justify-center">
          <IoPeopleOutline size={25} />
          <p className="font-bold">{community.member_count} members</p>
        </div>
        <Link
          href={{
            pathname: `/communities/${community.community_name}`,
            query: {community: community.community_id},
          }}
          className="border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
        >
          <span>View</span>
        </Link>
      </div>
      <div className="flex gap-4 items-center justify-between px-4 py-4 bg-gray-300 rounded-b">
        <div className="flex gap-2 justify-center">
          <IoStorefrontOutline size={25} />
          <p className="text-center font-bold">{community.business_count}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <IoWalkOutline size={25} />
          <p className="text-center font-bold">{community.group_count}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <IoSchoolOutline size={25} />
          <p className="text-center font-bold">{community.school_count}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <MdOutlineChurch size={25} />
          <p className="text-center font-bold">{community.church_count}</p>
        </div>
      </div>
    </section>
  );
};

export default CommunityCard;
