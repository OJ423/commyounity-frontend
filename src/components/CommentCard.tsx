"use client"

import { Comment, PostData } from "@/utils/customTypes"
import { useAuth } from "./context/AuthContext"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

interface CommentCardProps {
  comment: Comment,
  comments: Comment[]
  post: PostData[]
}


const CommentCard: React.FC<CommentCardProps> = ({comment, comments, post}) => {
  const {user, userMemberships} = useAuth();
  const [member, setMember] = useState<boolean>(false)

  
  useEffect(() => {
      if (post[0].group_id && userMemberships) {
        const memberCheck = userMemberships?.userMemberships?.groups.some(
          (g) => g.group_id === post[0].group_id
        );
        if (memberCheck) {
          setMember(true)
        } 
      }
    },[post, userMemberships])
    console.log(comment.user_avatar)

  return(
    <>
    {!comment.comment_ref ?
      <section className="flex flex-col gap-2 pb-4 mb-4 border-b border-gray-200 w-full">
        <h3 className="font-semibold">{comment.comment_title}</h3>
        <p className="text-sm">{comment.comment_body}</p>
        {member ?
        
        <div className="flex justify-between items-center gap-2 mt-2 pt-2 border-t border-indigo-100">
          {user ? 
            +user.user_id === comment.author 
          ?
            <div className="flex gap-2">
              <Link href="" className="text-xs border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                <span>Delete</span>
              </Link>
              <Link href="" className="text-xs border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                <span>Reply</span>
              </Link>
            </div>
          :
            <Link href="" className="text-xs border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Reply</span>
            </Link>
          :
            null
          }
          <div className="flex gap-4 items-center">
            {comment.user_avatar ?
            <div className="w-12 h-12">
              <Image
                src={comment.user_avatar}
                alt={comment.author_name}
                width={20}
                height={20}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            : null
            }
            <p className="font-bold text-sm py-2 px-4 bg-indigo-100 rounded">{comment.author_name}</p>
          </div>
        </div>
        :
        <div className="flex justify-end items-center gap-4 mt-2 pt-2 border-t border-indigo-100">
          {comment.user_avatar ?
            <div className="w-12 h-12">
              <Image
                src={comment.user_avatar}
                alt={comment.author_name}
                width={20}
                height={20}
                quality={60}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            : null
            }
          <p className="font-bold text-sm py-2 px-4 bg-indigo-100 rounded">{comment.author_name}</p>
        </div>
        }
      </section>
      :
      null

    }
    </>
  )
}

export default CommentCard