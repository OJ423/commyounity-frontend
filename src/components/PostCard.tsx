"use client";

import { PostData, TimelinePosts } from "@/utils/customTypes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoHeartOutline, IoChatboxOutline } from "react-icons/io5";
import { BsFillReplyFill } from "react-icons/bs";
import CommentList from "./CommentList";
import { useAuth } from "./context/AuthContext";
import { deletePost, dislikePost, likePost } from "@/utils/apiCalls";
import { usePathname, useRouter } from "next/navigation";
import { formatDate } from "@/utils/dataTransformers";
import CommentNewForm from "./CommentNewForm";
import { LogUserOut } from "@/utils/logOut";
import ReactPlayer from "react-player";
import PostEditButton from "./PostEditButton";
import { MdDelete } from "react-icons/md";
import UserBio from "./UserBio";

type PostCardProps = {
  data: PostData | TimelinePosts;
  member: boolean;
  owner: boolean;
};

const PostCard: React.FC<PostCardProps> = ({ data, member, owner }) => {
  const [viewComments, setViewComments] = useState<boolean>(false);
  const [displayAddComment, setDisplayAddComment] = useState<boolean>(false);
  const [postLikes, setPostLikes] = useState<number>(data.post_likes);
  const [userLike, setUserLike] = useState<boolean>(false);
  const [deleteCheck, setDeleteCheck] = useState<boolean>(false);
  const [postAuthor, setPostAuthor] = useState<boolean>(false);
  const [showUserBio, setShowUserBio] = useState<boolean>(false);

  const {
    user,
    setUser,
    userPostLikes,
    setUserPostLikes,
    token,
    setToken,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setAdminCommunities,
  } = useAuth();

  const router = useRouter();
  const path = usePathname()

  // Toggle Userbio

  const handleShowUserBio = () => {
    setShowUserBio(!showUserBio);
  };

  useEffect(() => {
    if (userPostLikes) {
      const userPostLikeCheck: boolean = userPostLikes.some(
        (post) => post.post_id === data.post_id
      );
      setUserLike(userPostLikeCheck);
    }
    if (user?.user_id === data.author) {
      setPostAuthor(true);
    }
  }, [userPostLikes, data.post_id, data.author, user?.user_id]);

  function handleShowComments() {
    if (+data.comment_count && member) {
      setViewComments(!viewComments);
    }
  }

  function handleAddComment() {
    if (member) {
      setDisplayAddComment(!displayAddComment);
    }
  }

  async function handlePostLike() {
    try {
      if (user) {
        const usersLikedPosts = await likePost(
          user?.user_id,
          data.post_id,
          token
        );
        setUserPostLikes(usersLikedPosts);
        localStorage.setItem("userPostLikes", JSON.stringify(usersLikedPosts));
        setPostLikes(postLikes + 1);
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log("something has gone wrong.");
    }
  }

  async function handlePostDislike() {
    try {
      if (user) {
        const usersLikedPosts = await dislikePost(
          user?.user_id,
          data.post_id,
          token
        );
        setUserPostLikes(usersLikedPosts);
        localStorage.setItem("userPostLikes", JSON.stringify(usersLikedPosts));
        setPostLikes(postLikes - 1);
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log("something has gone wrong.");
    }
  }

  const deletePostCheck = () => {
    setDeleteCheck(!deleteCheck);
  };

  const handleDeletePost = async () => {
    try {
      const deleteRequest = await deletePost(token, data.post_id);
      setDeleteCheck(!deleteCheck);
      setToken(deleteRequest.token);
      localStorage.setItem("token", deleteRequest.token);
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log("something has gone wrong.");
    }
  };

  const invalidTokenResponse = (): void => {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
      setAdminCommunities,
    });
    router.push("/login");
  };

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-5 items-center rounded shadow-xl transition-500 duration-200 ease-in ease-out cursor-pointer relative">
        {data.post_video_url ? (
          <>
            <ReactPlayer
              url={data.post_video_url}
              controls={true}
              width={"100%"}
              className="w-[100%] h-auto col-span-1 md:col-span-5 bg-indigo-500 rounded-xl mx-auto"
            />
          </>
        ) : data.post_img ? (
          <div className="md:col-span-2 w-full h-80 md:h-full rounded-t md:rounded-tl overflow-hidden">
            <Image
              src={data.post_img}
              alt={`${data.post_title} header image`}
              priority
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-t md:rounded-tl"
            />
          </div>
        ) : null}

        <div
          className={`${data.post_img ? "md:col-span-3" : "col-span-5"} p-4`}
        >
          <div className="flex gap-4 items-center my-4 col-span-1 md:col-span-5">
            <div>
              {data.group_id ? (
                <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded">
                  Group
                </p>
              ) : data.business_id ? (
                <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded">
                  Business
                </p>
              ) : data.school_id ? (
                <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded">
                  School
                </p>
              ) : data.church_id ? (
                <p className="text-xs font-bold p-2 bg-indigo-500 text-white rounded">
                  Church
                </p>
              ) : null}
            </div>
            <p className="text-xs font-semibold text-indigo-500 p-2 bg-indigo-100 rounded">
              {formatDate(data.post_date)}
            </p>
            <p
              onClick={handleShowUserBio}
              className="text-xs font-semibold text-indigo-500 p-2 bg-indigo-100 rounded"
            >
              {data.username}
            </p>
          </div>
          <span className="text-sm proper text-gray-400 hover:text-indigo-500 font-semibold transition-all duration-500">
            {path.includes('/timeline') ?
            <>
              {data.name && data.name !==null && <Link href={`/groups/${data.group_id}`}>{data.name}</Link>}
              {data.business_name && <Link href={`/businesses/${data.business_id}`}>{data.business_name}</Link>}
              {data.church_name && <Link href={`/churches/${data.church_id}`}>{data.church_name}</Link>}
              {data.group_name && <Link href={`/groups/${data.group_id}`}>{data.group_name}</Link>}
              {data.school_name && <Link href={`/schools/${data.school_id}`}>{data.school_name}</Link>}
            </>
            :
            <>
              {data.business_id && <Link href={`/businesses/${data.business_id}`}>{data.name}</Link>}
              {data.church_id && <Link href={`/churches/${data.church_id}`}>{data.name}</Link>}
              {data.group_id && <Link href={`/groups/${data.group_id}`}>{data.name}</Link>}
              {data.school_id && <Link href={`/schools/${data.school_id}`}>{data.name}</Link>}
            </>
            }          
          </span>
          <h2 className="font-bold text-xl mb-4">{data.post_title}</h2>
          <p className="font-light">{data.post_description}</p>
          {data.post_location ? (
            <p className="font-medium text-sm mt-4 text-indigo-500">
              Location: {data.post_location}
            </p>
          ) : null}
          {data.web_link ? (
            data.web_title ? (
              <p className="text-sm font-semibold mt-4">
                More info:{" "}
                <Link
                  className="text-indigo-500 hover:text-indigo-300 transition-all duration-500"
                  href={data.web_link}
                  target="_blank"
                >
                  {data.web_title}
                </Link>
              </p>
            ) : (
              <p className="text-sm font-semibold mt-4">
                More info:{" "}
                <Link
                  className="text-indigo-500 hover:text-indigo-300 transition-all duration-500"
                  href={data.web_link}
                  target="_blank"
                >
                  {data.web_link}
                </Link>
              </p>
            )
          ) : null}
        </div>
        <div className="p-3 bg-indigo-200 rounded-b md:col-span-5 flex flex-wrap gap-5 items-center justify-end">
          <div className="flex gap-4 items-center justify-between w-full sm:w-auto">
            {owner || postAuthor ? (
              <div className="me-4 flex gap-4">
                {deleteCheck ? (
                  <>
                    <button
                      onClick={handleDeletePost}
                      className="text-xs border-solid border-4 border-red-500 text-red-500 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 ease-out"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={deletePostCheck}
                      className="text-xs border-solid border-4 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <PostEditButton
                      data={data}
                      owner={owner}
                      postAuthor={postAuthor}
                    />
                    <button
                      onClick={deletePostCheck}
                      className="text-red-500 hover:scale-110 transition-all duration-500 ease-out"
                    >
                      <MdDelete
                        aria-label="delete post"
                        size={24}
                        title="Delete Post"
                      />
                    </button>
                  </>
                )}
              </div>
            ) : null}
            {userLike ? (
              <div
                onClick={() => (user ? handlePostDislike() : null)}
                className="flex items-center text-rose-600 gap-1 transition-all duration-200"
              >
                <IoHeartOutline
                  size={24}
                  aria-label="remove your like from this post"
                  title="Remove Like"
                />
                <p className="text-black font-bold text-sm">
                  {postLikes > 2
                    ? `You and ${postLikes - 1} others`
                    : postLikes === 2
                    ? `You and 1 other`
                    : "You like this"}
                </p>
              </div>
            ) : (
              <div
                onClick={() => (user ? handlePostLike() : null)}
                className="flex items-center text-rose-600 gap-1 hover:scale-110 transition-all duration-200"
              >
                <IoHeartOutline
                  size={24}
                  aria-label="Like post"
                  title="Like Post"
                />
                <p className="text-black font-bold text-sm">{postLikes}</p>
              </div>
            )}
            <div
              onClick={() => (user ? handleShowComments() : null)}
              className="flex items-center text-indigo-500 gap-1 hover:scale-110 transition-all duration-200"
            >
              <IoChatboxOutline
                size={24}
                aria-label="Show comments"
                title="Show Comments"
              />
              <p className="text-black font-bold text-sm">
                {data.comment_count}
              </p>
            </div>
            <div
              onClick={() =>
                user ? (member ? handleAddComment() : null) : null
              }
              className="flex items-center text-indigo-500 gap-1 hover:scale-110 transition-all duration-200"
            >
              <BsFillReplyFill
                size={24}
                aria-label="Comment on post"
                title="Comment on Post"
              />
            </div>
          </div>
        </div>
        <section className={`w-full bottom-0 bg-white md:col-span-5 rounded-b`}>
          {displayAddComment ? (
            <CommentNewForm
              post_id={data.post_id}
              comment_ref={null}
              setDisplayAddComment={setDisplayAddComment}
              displayAddComment={displayAddComment}
              setViewComments={setViewComments}
              invalidTokenResponse={invalidTokenResponse}
            />
          ) : null}
          {viewComments ? (
            <CommentList
              viewComments={viewComments}
              post_id={data.post_id}
              invalidTokenResponse={invalidTokenResponse}
              owner={owner}
            />
          ) : null}
        </section>
      </section>
      {member && (
        <UserBio
          username={data.username}
          handleShowUserBio={handleShowUserBio}
          showUserBio={showUserBio}
          member={member}
        />
      )}
    </>
  );
};

export default PostCard;
