import { CardData } from "@/utils/customTypes";
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
  data: CardData;
};

const GenericCard: React.FC<ListProps> = ({ data }) => {
  return (
      <section className="rounded bg-gray-200 pb-4 drop-shadow-xl">
        <Image
          src="/placeholder-image.webp"
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${data.name}`}
          className="w-full h-60 object-cover rounded mb-4"
        />
      <div className="p-4">
        <h3 className="font-semibold text-lg pb-4">
          {data.name}
        </h3>
        <p className="font-medium text-sm">{data.bio}</p>
      </div>
      </section>
  );
};

export default GenericCard;