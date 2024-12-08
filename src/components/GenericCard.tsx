import { CardData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";

type ListProps = {
  data: CardData;
  urlParams: string;
  communityMember: boolean;
  owner: boolean;
};

const GenericCard: React.FC<ListProps> = ({
  data,
  urlParams,
  communityMember,
  owner,
}) => {
  return (
    <section className="rounded bg-gray-200 pb-4 shadow-xl flex flex-col justify-between">
      {data.img ? (
        <Image
          src={data.img}
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${data.name}`}
          className="w-full h-60 object-cover rounded-t mb-4"
        />
      ) : (
        <Image
          src="/placeholder-image.webp"
          width={200}
          height={100}
          quality={60}
          priority
          alt={`${data.name}`}
          className="w-full h-60 object-cover rounded-t mb-4"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg pb-4">{data.name}</h3>
        <p className="font-medium text-sm">{data.bio}</p>
      </div>
      {communityMember || owner ? (
        <Link
          href={`${urlParams}${data.id}`}
          className="m-4 w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
        >
          <span>View</span>
        </Link>
      ) : null}
    </section>
  );
};

export default GenericCard;
