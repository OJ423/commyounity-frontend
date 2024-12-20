"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { NewPostData, UnsplashImage } from "@/utils/customTypes";
import { handleUpload } from "@/utils/blobFuncs";
import { addPost } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UnsplashImgSearch from "./UnplashImgSearch";

interface NewPostFormProps {
  type: string;
  id: string | undefined;
  fetchPosts: boolean;
  setFetchPosts: React.Dispatch<React.SetStateAction<boolean>>;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeSelected?:React.Dispatch<React.SetStateAction<boolean>>
  setType?: React.Dispatch<React.SetStateAction<string>>
}

const NewPostForm: React.FC<NewPostFormProps> = ({
  type,
  id,
  fetchPosts,
  setFetchPosts,
  showForm,
  setShowForm,
  setTypeSelected,
  setType
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

  // Image Upload Type
  const [imageInsertType, setImageInsertType] = useState<string>("upload");
  const handleUploadType = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setImageInsertType("upload");
  };
  const handleUnsplashType = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setImageInsertType("unsplash");
  };

  // Unsplash Search States & Funcs
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState<UnsplashImage[] | []>([]);
  const [imageConfirm, setImageConfirm] = useState<string>("");

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImages([]);
    setImageConfirm("Image selected");
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<NewPostData>();

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
      let imageUrl: string = "";
      if (selectedImage.length > 0) {
        imageUrl = selectedImage;
      }
      if (data.post_img && data.post_img.length) {
        imageUrl = await handleUpload(
          data.post_img[0],
          token,
          "no existing image"
        );
      }

      const webLink = data.web_link?.startsWith("http")
        ? data.web_link
        : !data.web_link
        ? null
        : `https://${data.web_link}`;
      const response = await addPost(
        type,
        id,
        data,
        webLink,
        user?.user_id,
        imageUrl,
        token
      );
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setFormSubmitted(!formSubmitted);
      setFetchPosts(!fetchPosts);
      if (setTypeSelected !== undefined) setTypeSelected(false)
      if (setType !== undefined) setType("")
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
    if (formState.isSubmitSuccessful) {
      reset({
        post_title: "",
        post_description: "",
        post_img: null,
        post_video_url: null,
        post_location: "",
        web_link: "",
        web_title: "",
      });
      setImageConfirm("");
      setSelectedImage("")
    }
  }, [formState, reset]);

  return (
    <>
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

        <div className="flex gap-4 items-center">
          <button
            onClick={handleUploadType}
            className={`${
              imageInsertType === "upload"
                ? "bg-white border-x-2 border-t-2 border-indigo-500 z-50 font-bold"
                : null
            } mb-[-3px] p-2 text-xs transition-all duration-200`}
          >
            Upload Image
          </button>
          <button
            onClick={handleUnsplashType}
            className={`${
              imageInsertType === "unsplash"
                ? "bg-white border-x-2 border-t-2 border-indigo-500 z-50 font-bold"
                : null
            } mb-[-2px] p-2 text-xs transition-all duration-200`}
          >
            Use Stock Image
          </button>
        </div>
        <div className="flex flex-col p-2 border-2 border-indigo-500 mb-8">
          {imageInsertType === "upload" ? (
            <>
              <label
                className="text-xs uppercase text-gray-700 font-bold"
                htmlFor="post_img"
              >
                Upload {type} image:
              </label>
              <input
                className="p-4 mb-4 rounded border-2 mt-2 file:px-4 file:py-2 file:transition-all file:duration-500 file:me-4 file:cursor-pointer"
                {...register("post_img")}
                id="post_img"
                name="post_img"
                type="file"
              />
            </>
          ) : imageInsertType === "unsplash" ? (
            <UnsplashImgSearch
              onSelectImage={handleImageSelect}
              images={images}
              setImages={setImages}
              imageConfirm={imageConfirm}
            />
          ) : null}
        </div>

        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
        />
        {newPostErr ? (
          <p className="text-rose-600 font-bold">{newPostErr}</p>
        ) : null}
      </form>
    </>
  );
};

export default NewPostForm;
