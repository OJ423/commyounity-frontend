"use client";

import { Comment, PostData } from "@/utils/customTypes";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import CommentNewForm from "./CommentNewForm";
import { LiaComments } from "react-icons/lia";
import { deleteComment } from "@/utils/apiCalls";
import { MdDelete } from "react-icons/md";
import { BsFillReplyFill } from "react-icons/bs";
import CommentEditButton from "./CommentEditButton";
import UserBio from "./UserBio";

interface CommentCardProps {
  comment: Comment;
  comments: Comment[];
  post: PostData[];
  invalidTokenResponse: () => void;
  owner: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  comments,
  post,
  invalidTokenResponse,
  owner,
}) => {
  const { user, userMemberships, token, setToken } = useAuth();
  const [member, setMember] = useState<boolean>(false);
  const [replyCommentCount, setReplyCommentCount] = useState<number>(0);
  const [replyComments, setReplyComments] = useState<Comment[] | []>([]);
  const [displayAddComment, setDisplayAddComment] = useState<boolean>(false);
  const [viewReplies, setViewReplies] = useState<boolean>(false);
  const [apiErr, setApiErr] = useState<string | null>(null);
  const [showUserBio, setShowUserBio] = useState<boolean>(false);

  // Toggle Userbio

  const handleShowUserBio = () => {
    setShowUserBio(!showUserBio);
  };

  const handleDeleteComment = async (id: string | null) => {
    try {
      let commentId;
      if (id) commentId = id;
      else {
        commentId = comment.comment_id;
      }
      if (user && user.user_id === comment.author) {
        const data = await deleteComment(token, commentId, post[0]?.post_id);
        setToken(data.token);
        localStorage.setItem("token", data.token);
      }
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error deleting your comment, please try again.`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  };

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
        <section className="flex flex-col gap-2 pb-2 mb-4 border-b border-gray-200 w-full">
          <h3 className="font-semibold">{comment.comment_title}</h3>
          <p className="text-sm">{comment.comment_body}</p>
          {member || owner ? (
            <div className="flex justify-between items-center gap-2 mt-2 pt-2 border-t border-indigo-100">
              <div className="flex gap-4">
                <button
                  className="text-indigo-500 hover:scale-125 transition-all duration-500 ease-out"
                  onClick={() => setDisplayAddComment(!displayAddComment)}
                >
                  <BsFillReplyFill
                    size={24}
                    aria-label="reply to comment"
                    title="Reply to Comment"
                  />
                </button>
                {user?.user_id === comment.author ? (
                  <CommentEditButton data={comment} />
                ) : null}
                {user?.user_id === comment.author || owner ? (
                  <button
                    onClick={() => handleDeleteComment(null)}
                    className="text-red-500 hover:scale-125 transition-all duration-500 ease-out"
                  >
                    <MdDelete
                      size={24}
                      aria-label="Delete comment"
                      title="Delete Comment"
                    />
                  </button>
                ) : null}
              </div>
              <div className="flex gap-4 items-center">
                {replyCommentCount ? (
                  <button
                    onClick={() => setViewReplies(!viewReplies)}
                    className="flex items-center gap-4 ms-auto p-2 bg-indigo-100 rounded transition-all duration-500 hover:bg-indigo-200"
                  >
                    <LiaComments size={24} className="text-indigo-500" />
                    <p className="font-bold text-xs">{replyCommentCount}</p>
                  </button>
                ) : null}
                {comment.user_avatar ? (
                  <div onClick={handleShowUserBio} className="w-12 h-12">
                    <Image
                      src={comment.user_avatar}
                      alt={comment.author_name}
                      width={20}
                      height={20}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <p onClick={handleShowUserBio} className="font-bold text-sm py-2 px-4 bg-indigo-100 rounded">
                  {comment.author_name}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`${
                  user?.user_id === comment.author
                    ? "justify-between"
                    : "justify-end"
                } flex items-center gap-4 mt-2 pt-2 border-t border-indigo-100`}
              >
                {user?.user_id === comment.author || owner ? (
                  <>
                    <button
                      onClick={() => handleDeleteComment(null)}
                      className="text-red-500 hover:scale-125 transition-all duration-500 ease-out"
                    >
                      <MdDelete
                        size={24}
                        aria-label="Delete comment"
                        title="Delete Comment"
                      />
                    </button>
                  </>
                ) : null}
                <div className="flex items-center gap-4">
                  {comment.user_avatar ? (
                    <div onClick={handleShowUserBio} className="w-12 h-12">
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
                  <p onClick={handleShowUserBio} className="font-bold text-sm py-2 px-4 bg-indigo-100 rounded">
                    {comment.author_name}
                  </p>
                </div>
              </div>
            </>
          )}
        </section>
      ) : null}
      {displayAddComment ? (
        <section className="flex flex-col w-full border-box gap-2 pb-2 mb-2 border-b border-gray-200 w-4/5 ms-auto">
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
      {viewReplies ? (
        <section className="flex flex-col max-w-[80%] p-4 border-box gap-8 pb-2 mb-8 border-b-4 border-indigo-500 ms-auto">
          {replyComments.map((c) => (
            <section
              className="flex items-center justify-end gap-16 bg-gray-100 rounded-lg p-4"
              key={c.comment_id}
            >
              <div>
                <p className="font-semibold">{c.comment_title}</p>
                <p>{c.comment_body}</p>
                {user ? (
                  user?.user_id === c.author || owner ? (
                    <button
                      onClick={() => handleDeleteComment(null)}
                      className="text-red-500 hover:scale-125 transition-all duration-500 ease-out"
                    >
                      <MdDelete
                        size={24}
                        aria-label="Delete comment"
                        title="Delete Comment"
                      />
                    </button>
                  ) : null
                ) : null}
              </div>
              <div className="flex flex-col items-center gap-4">
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
              </div>
            </section>
          ))}
        </section>
      ) : null}
        <UserBio
          username={comment.author_name}
          handleShowUserBio={handleShowUserBio}
          showUserBio={showUserBio}
          member={member}
        />
    </>
  );
};

export default CommentCard;
