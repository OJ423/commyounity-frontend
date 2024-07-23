"use client"

import { PostData } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoHeartOutline, IoChatboxOutline } from "react-icons/io5";
import { BsFillReplyFill } from "react-icons/bs";
import CommentList from "./CommentList";
import { useAuth } from "./context/AuthContext";
import { dislikePost, likePost } from "@/utils/apiCalls";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dataTransformers";

type PostCardProps = {
  data: PostData;
  member: boolean;
};

const PostCard: React.FC<PostCardProps> = ({data, member}) => {
  const [viewComments, setViewComments] = useState<boolean>(false)
  const [postLikes, setPostLikes] = useState<number>(data.post_likes)
  const {user, setUser, userPostLikes, setUserPostLikes, token, setToken, setCommunities, setSelectedCommunity, setUserMemberships} = useAuth()
  const router = useRouter()

  const userPostLikeCheck:boolean = userPostLikes.some(
    (post) => post.post_id === +data.post_id
  );

  function handleShowComments() {
    if (+data.comment_count && member) {
      setViewComments(!viewComments)
    }
  }

  function handleAddComment() {
    alert("This is a place holder to add a comment")
  }

  async function handlePostLike() {
    try {
      if(user) {
        const usersLikedPosts = await likePost(+user?.user_id, data.post_id, token);
        setUserPostLikes(usersLikedPosts);
        localStorage.setItem("userPostLikes", JSON.stringify(usersLikedPosts))
        setPostLikes(postLikes + 1)
      }
    } catch(error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log("something has gone wrong.")
    }
  }

  async function handlePostDislike() {
    try {
      if(user) {
        const usersLikedPosts = await dislikePost(+user?.user_id, data.post_id, token);
        setUserPostLikes(usersLikedPosts);
        localStorage.setItem("userPostLikes", JSON.stringify(usersLikedPosts))
        setPostLikes(postLikes - 1)
      }
    } catch(error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log("something has gone wrong.")
    }
  }

  const invalidTokenResponse = () :void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('communities')
    localStorage.removeItem('selectedCommunity')
    localStorage.removeItem('userMemberships')
    localStorage.removeItem('userPostLikes')
    setToken(null);
    setUser(null)
    setCommunities([])
    setSelectedCommunity(null)
    setUserMemberships(null)
    setUserPostLikes([])
    router.push('/login')
  }

  const formattedDate = formatDate(data.post_date);


  return(
    <>
    <section className="grid grid-cols-1 md:grid-cols-5 items-center rounded shadow-xl transition-500 duration-200 ease-in ease-out cursor-pointer relative">
      {data.post_img ?
        <div className="md:col-span-2 w-full h-40 max-h-60 md:h-full rounded-t md:rounded-tl overflow-hidden">
          <Image 
            src={data.post_img}
            alt={`${data.post_title} header image`}
            priority
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t md:rounded-tl"
          />
        </div>
      :
        <div className="md:col-span-2 w-full md:h-full rounded-t md:rounded-tl overflow-hidden">
          <Image 
            src="/placeholder-image.webp"
            alt={`${data.post_title} header image`}
            priority
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t md:rounded-tl"
          />
        </div>
      }
      
      <div className="md:col-span-3 p-4">
        <h2 className="font-bold text-lg mb-4">{data.post_title}</h2>
        <p className="font-light">{data.post_description}</p>
        {data.web_link ? data.web_title ?
        <p className="text-sm font-semibold mt-4">More info: <Link className="text-indigo-500 hover:text-indigo-300 transition-all duration-500" href={data.web_link} target="_blank">
           {data.web_title}
          </Link>
        </p>
        :
        <p className="text-sm font-semibold mt-4">More info: <Link className="text-indigo-500 hover:text-indigo-300 transition-all duration-500" href={data.web_link} target="_blank">
            {data.web_link}
          </Link>
        </p>
        :
        null
        }
      </div>
      <div className="p-3 bg-indigo-200 rounded-b md:col-span-5 flex gap-5 items-center justify-between">
        <p className="text-xs font-semibold">Posted: {formattedDate}</p>
        <div className="flex gap-4">
          {userPostLikeCheck ?
          <div onClick={handlePostDislike} className="flex items-center text-rose-600 gap-1 transition-all duration-200">
            <IoHeartOutline size={24}/>
            <p className="text-black font-bold text-sm">{postLikes > 2 ? `You and ${postLikes-1} others` :  postLikes === 2 ? `You and 1 other`: 'You like this'}</p>
          </div>
          :
          <div onClick={handlePostLike} className="flex items-center text-rose-600 gap-1 hover:scale-110 transition-all duration-200">
            <IoHeartOutline size={24}/>
            <p className="text-black font-bold text-sm">{postLikes}</p>
          </div>
          }
          <div onClick={handleShowComments} className="flex items-center text-indigo-500 gap-1 hover:scale-110 transition-all duration-200">
            <IoChatboxOutline size={24}/>
            <p className="text-black font-bold text-sm">{data.comment_count}</p>
          </div>
          <div onClick={handleAddComment} className="flex items-center text-indigo-500 gap-1 hover:scale-110 transition-all duration-200">
            <BsFillReplyFill size={24}/>
          </div>
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
      <section className={`w-full bottom-0 bg-white md:col-span-5 rounded-b`}>
      {viewComments ?
        <CommentList viewComments={viewComments} post_id={data.post_id} />
      :
        null    
      }
      </section> 
    </section>
    </> 
  )
}

export default PostCard