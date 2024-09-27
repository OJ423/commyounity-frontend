"use client";

import { Comment, PostData } from "@/utils/customTypes";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import CommentNewForm from "./CommentNewForm";
import { LiaComments } from "react-icons/lia";


interface CommentCardProps {
  comment: Comment;
  comments: Comment[];
  post: PostData[];
  invalidTokenResponse: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  comments,
  post,
  invalidTokenResponse,
}) => {
  const { user, userMemberships, token } = useAuth();
  const [member, setMember] = useState<boolean>(false);
  const [replyCommentCount, setReplyCommentCount] = useState<number>(0);
  const [replyComments, setReplyComments] = useState<Comment[] | []>([]);
  const [displayAddComment, setDisplayAddComment] = useState<boolean>(false);
  const [viewReplies, setViewReplies] = useState<boolean>(false);

  useEffect(() => {
    if (post[0].group_id && userMemberships) {
      const memberCheck = userMemberships?.userMemberships?.groups.some(
        (g) => g.group_id === post[0].group_id
      );
      if (memberCheck) {
        setMember(true);
      }
    }

    const replyFilter = comments.filter(
      (c) => c.comment_ref === comment.comment_id
    );
    setReplyCommentCount(replyFilter.length);
    setReplyComments(replyFilter);
  }, [post, userMemberships, comment, comments, token]);

  return (
    <>
      {!comment.comment_ref ? (
        <section className="flex flex-col gap-2 pb-4 mb-4 border-b border-gray-200 w-full">
          <h3 className="font-semibold">{comment.comment_title}</h3>
          <p className="text-sm">{comment.comment_body}</p>
          {member ? (
            <div className="flex justify-between items-center gap-2 mt-2 pt-2 border-t border-indigo-100">
              {user ? (
                +user.user_id === comment.author ? (
                  <div className="flex gap-2">
                    <button className="text-xs border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setDisplayAddComment(!displayAddComment)}
                      className="text-xs border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                    >
                      <span>Reply</span>
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-xs border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                    onClick={() => setDisplayAddComment(!displayAddComment)}
                  >
                    <span>Reply</span>
                  </button>
                )
              ) : null}
              <div className="flex gap-4 items-center">
                {comment.user_avatar ? (
                  <div className="w-12 h-12">
                    <Image
                      src={comment.user_avatar}
                      alt={comment.author_name}
                      width={20}
                      height={20}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <p className="font-bold text-sm py-2 px-4 bg-indigo-100 rounded">
                  {comment.author_name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-end items-center gap-4 mt-2 pt-2 border-t border-indigo-100">
              {comment.user_avatar ? (
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
              ) : null}
              <p className="font-bold text-sm py-2 px-4 bg-indigo-100 rounded">
                {comment.author_name}
              </p>
            </div>
          )}
          {replyCommentCount ?
            <button
              onClick={() => setViewReplies(!viewReplies)}
              className="flex items-center gap-4 ms-auto mt-4 p-2 bg-indigo-100 rounded transition-all duration-500 hover:bg-indigo-200">
              <LiaComments size={24} className="text-indigo-500"/>
              <p className="font-bold text-xs">{replyCommentCount}</p>
            </button>
          : null
          }
        </section>
      ) : null 
      }
      {displayAddComment ? (
        <section className="flex flex-col w-full border-box gap-2 pb-4 mb-4 border-b border-gray-200 w-4/5 ms-auto">
          <CommentNewForm
            post_id={comment.post_id}
            comment_ref={comment.comment_id}
            setDisplayAddComment={() =>
              setDisplayAddComment(!displayAddComment)
            }
            displayAddComment={displayAddComment}
            setViewComments={setViewReplies}
            invalidTokenResponse={invalidTokenResponse}
          />
        </section>
      ) : null}
      {viewReplies ? 
        <section className="flex flex-col w-4/5 p-4 border-box gap-8 pb-4 mb-8 border-b-4 border-indigo-500 ms-auto">
          {replyComments.map((c) => (
            <section 
              className="flex items-center justify-end gap-16 bg-gray-100 rounded-lg p-4"
              key={c.comment_id}
            >
              <div>
                <p className="font-semibold">{c.comment_title}</p>
                <p>{c.comment_body}</p>
              </div>
              <div className="flex items-center gap-4">
              {c.user_avatar ? (
                <div className="w-12 h-12">
                  <Image
                    src={c.user_avatar}
                    alt={c.author_name}
                    width={20}
                    height={20}
                    quality={60}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
              ) : null}
                <p className="font-semibold">{c.author_name}</p>
              </div>
            </section>
          ))}
        </section>
       : null}

    </>
  );
};

export default CommentCard;
