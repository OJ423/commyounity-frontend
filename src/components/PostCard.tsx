import { PostData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { IoHeartOutline, IoChatboxOutline } from "react-icons/io5";


type PostCardProps = {
  data: PostData;
};

const PostCard: React.FC<PostCardProps> = ({data}) => {

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day} ${month} '${String(year).slice(-2)}`;
  }
  
  const formattedDate = formatDate(data.post_date);


  return(
    <section className="grid grid-cols-1 md:grid-cols-5 rounded shadow-xl md:hover:scale-110 transition-500 duration-200 ease-in ease-out cursor-pointer relative">
      <Image 
        src="/placeholder-image.webp"
        alt={`${data.post_title} header image`}
        priority
        width={200}
        height={200}
        className="w-full h-40 md:col-span-2 md:h-full md:w-auto object-cover rounded"
      />
      <div className="md:col-span-3 p-4">
        <h2 className="font-bold text-lg mb-4">{data.post_title}</h2>
        <p className="font-light">{data.post_description}</p>
        {data.pdf_link ? 
        <p className="text-sm">More info: <Link className="text-indigo-500 hover:text-indigo-300 transition-all duration-500" href={data.pdf_link}>{data.pdf_title}</Link></p>
        :
        null
        }
      </div>
      <div className="p-3 bg-indigo-200 rounded-b md:col-span-5 flex gap-5 items-center justify-center">
        <p className="text-xs font-semibold">Posted: {formattedDate}</p>
        <div className="flex items-center text-rose-600 gap-1">
          <IoHeartOutline size={24}/>
          <p className="text-black font-bold text-sm">{data.post_likes}</p>
        </div>
        <div className="flex items-center text-indigo-500 gap-1">
          <IoChatboxOutline size={24}/>
          <p className="text-black font-bold text-sm">{data.comment_count}</p>
        </div>
      </div>
      <div className="absolute top-2 left-2">
        {data.group_id ?
          <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded-xl">Group</p>
        :
        data.business_id ?
          <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded-xl">Business</p>
        :
        data.school_id ?
          <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded-xl">School</p>
        :
        data.church_id ?
          <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded-xl">Church</p>
        :
        null
        }
      </div>
    </section>)
}

export default PostCard