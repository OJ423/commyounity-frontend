"use client"

import { getPostComments } from "@/utils/apiCalls"
import { useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import { Comment, PostData } from "@/utils/customTypes"
import { useAuth } from "./context/AuthContext"

interface CommentListProps {
  viewComments: boolean,
  post_id:number,
  invalidTokenResponse: () => void;
  owner:boolean;
}
const CommentList: React.FC<CommentListProps> = ({viewComments, post_id, invalidTokenResponse, owner}) => {
  const [comments, setComments] = useState<Comment[] | []>([])
  const [post, setPost] = useState<PostData[] | []>([])
  const {token, setToken} = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostComments(token, post_id)
        setComments(data.comments)
        setPost(data.post)
        setToken(data.token)
        localStorage.setItem("token", data.token)
      } catch(error:any) {
        console.log(error)
      }
    }
    fetchData()
  },[post_id, token])

  return (
    <div className={`transition-all duration-500 ease-in bg-white w-full flex flex-col items-start justify-start p-4 rounded-b`}>
      {comments.map((comment: Comment) => (
            <CommentCard key={comment.comment_id} comments={comments} comment={comment} post={post} invalidTokenResponse={invalidTokenResponse} owner={owner} />
        ))}
    </div>
  )
}

export default CommentList