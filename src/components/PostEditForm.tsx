"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { NewPostData, PostData, TimelinePosts } from "@/utils/customTypes";
import { editPost } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EditPostProps {
  owner: boolean;
  postAuthor: boolean;
  postData: PostData | TimelinePosts;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPostForm: React.FC<EditPostProps> = ({
  owner,
  postAuthor,
  postData,
  showForm,
  setShowForm,
}) => {
  const {
    user,
    token,
    setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setAdminCommunities,
  } = useAuth();

  const [newPostErr, setNewPostErr] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<NewPostData>({
    defaultValues: {
      post_title: postData.post_title,
      post_description: postData.post_description,
      post_location: postData.post_location,
      post_video_url: postData.post_video_url,
      web_link: postData.web_link,
      web_title: postData.web_title
    },
  });

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

  const onSubmit: SubmitHandler<NewPostData> = async (data) => {
    try {
      const webLink = data.web_link?.startsWith("http")
        ? data.web_link
        : !data.web_link
        ? null
        : `https://${data.web_link}`;
      const response = await editPost(token, postData.post_id, data);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setFormSubmitted(!formSubmitted);
      setShowForm(!showForm);
    } catch (error: any) {
      console.error("There was an error:", error);
      setNewPostErr(`There was an error creating the new post`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  };

  useEffect(() => {
    if (postData) {
      setValue("post_title", postData.post_title);
      setValue("post_description", postData.post_description);
      setValue("post_location", postData.post_location);
      setValue("post_video_url", postData.post_video_url);
      setValue("web_link", postData.web_link);
      setValue("web_title", postData.web_title)
    }
  }, [formState, postData, setValue]);

  return (
    <>
      {owner || postAuthor ?
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="post_title"
        >
          Post title:
        </label>
        <input
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder={`Post title`}
          {...register("post_title", {
            required: `Post title is required`,
            minLength: 5,
          })}
          id={`post_title`}
          name={`post_title`}
        />
        {errors.post_title && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Post title is required and needs to be at least 5 characters.
          </span>
        )}

        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="post_description"
        >
          Post description (Max 500 characters):
        </label>
        <textarea
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder={`Describe what the post is about`}
          {...register("post_description", {
            required: "Description required",
            minLength: 10,
            maxLength: 500,
          })}
          id="post_description"
          name="post_description"
          rows={4}
        />
        {errors.post_description && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            The post description needs to be 10 or more characters and less than
            500.
          </span>
        )}

        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="post_location"
          >
          Location
        </label>
        <input
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder="Add a location if relevant"
          {...register("post_location")}
          id="post_location"
          name="post_location"
        />

        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="web_link"
        >
          Web link:
        </label>
        <input
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder={`A link (PDF/Website) for more info`}
          {...register("web_link")}
          id="web_link"
          name="web_link"
        />

        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="web_title"
        >
          Web link Title:
        </label>
        <input
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder={`A readable title for your web link`}
          {...register("web_title")}
          id="web_title"
          name="web_title"
        />
        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="post_video_url"
          >
          Link to Video (paste YouTube or Vimeo link):
        </label>
        <input
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder={`Copy and paste a video share link`}
          {...register("post_video_url")}
          id="post_video_url"
          name="post_video_url"
        />

        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
        />
        {newPostErr ? (
          <p className="text-rose-600 font-bold">{newPostErr}</p>
        ) : null}
      </form>
    : null
    }
    </>
  );
};

export default EditPostForm;
