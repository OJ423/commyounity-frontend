"use client"

import { getPostComments } from "@/utils/apiCalls"
import { useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import { Comment, PostData } from "@/utils/customTypes"

interface CommentCardProps {
  viewComments: boolean,
  post_id:number,
}
const CommentList: React.FC<CommentCardProps> = ({viewComments, post_id}) => {
  const [comments, setComments] = useState<Comment[] | []>([])
  const [post, setPost] = useState<PostData[] | []>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostComments(post_id)
        setComments(data.comments)
        setPost(data.post)
      } catch(error:any) {
        console.log(error)
      }
    }
    fetchData()
  },[post_id])

  return (
    <div className={`transition-all duration-500 ease-in bg-white w-full flex flex-col items-start justify-start p-4 rounded-b`}>
      {comments.map((comment: Comment) => (
            <CommentCard key={comment.comment_id} comments={comments} comment={comment} post={post} />
        ))}
    </div>
  )
}

export default CommentList