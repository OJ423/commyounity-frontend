"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { Community, NewCommunity, UnsplashImage } from "@/utils/customTypes";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  fetchUserCommunities,
  getUserAdmins,
  getUserMemberships,
  patchCommunity,
  postCommunity,
} from "@/utils/apiCalls";
import UnsplashImgSearch from "./UnplashImgSearch";
import { handleUpload } from "@/utils/blobFuncs";
import { useRouter } from "next/navigation";
import { LogUserOut } from "@/utils/logOut";

interface CommunityNewFormProps {
  handleDisplayForm: () => void;
}

const CommunityNewForm: React.FC<CommunityNewFormProps> = ({
  handleDisplayForm,
}) => {
  const {
    user,
    token,
    setToken,
    setCommunities,
    setAdminCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setUser,
  } = useAuth();
  const [apiErr, setApiErr] = useState<string | null>(null);
  const router = useRouter();

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

  // Update User Communities

  async function updatedUserCommunities(token: string | null) {
    try {
      const response = await fetchUserCommunities(token);
      setCommunities(response.userCommunities);
      localStorage.setItem(
        "communities",
        JSON.stringify(response.userCommunities)
      );
      setAdminCommunities(response.userAdminCommunities);
      localStorage.setItem(
        "adminCommunities",
        JSON.stringify(response.userAdminCommunities)
      );
      setToken(response.token);
      localStorage.setItem("token", response.token);
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
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
        setApiErr("Your session has expired. Please login again.")
      }
      console.log(error);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCommunity>();

  const onSubmit: SubmitHandler<NewCommunity> = async (data) => {
    try {
      let imageUrl: string;
      if (selectedImage.length > 0) {
        imageUrl = selectedImage;
      } else if (data.community_img && data.community_img.length) {
        imageUrl = await handleUpload(
          data.community_img[0],
          token,
          "no existing image"
        );
      } else {
        imageUrl = "";
      }
      const body = {
        community_name: data.community_name,
        community_description: data.community_description,
        community_img: imageUrl,
      };
      const response: any = await postCommunity(body, token);
      updatedUserCommunities(token)
      router.push(
        `/communities/${response.newCommunity.community_name
          .replace(/ /g, "-")
          .toLowerCase()}?community=${response.newCommunity.community_id}`
      );
      handleDisplayForm();
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error editing the community.`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        setApiErr(
          "Your token has expired. Sorry about that. You'll need to login again to add this community"
        );
      }
    }
  };

  return (
    <>
      {user ? (
        <>
          <h2 className="font-bold text-2xl">Add a Community</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
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
                    className="text-xs uppercase text-gray-700 font-bold mt-4"
                    htmlFor="community_img"
                  >
                    Upload Community Image:
                  </label>
                  <input
                    className="p-4 mb-4 rounded border-2 mt-2 file:px-4 file:py-2 file:transition-all file:duration-500 file:me-4 file:cursor-pointer"
                    {...register("community_img")}
                    id="community_img"
                    name="community_img"
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
            <label
              className="text-xs uppercase text-gray-700 font-bold"
              htmlFor="community_name"
            >
              Community name:
            </label>
            <input
              className="p-4 mb-4 rounded border-2 mt-2"
              {...register("community_name", {
                required: `Community name is required`,
                minLength: 5,
              })}
              id={`community_name`}
              name={`community_name`}
            />
            {errors.community_name && (
              <span className="mb-4 text-rose-600 text-xs font-bold">
                Community name is required and needs to be at least 5
                characters.
              </span>
            )}

            <label
              className="text-xs uppercase text-gray-700 font-bold"
              htmlFor="community_name"
            >
              Community description (Max 1000 characters):
            </label>
            <textarea
              className="p-4 mb-4 rounded border-2 mt-2"
              {...register("community_description", {
                required: "community_description required",
                minLength: 10,
                maxLength: 1000,
              })}
              id="community_description"
              name="community_description"
              rows={6}
            />
            {errors.community_description && (
              <span className="mb-4 text-rose-600 text-xs font-bold">
                Community_description needs to be 10 or more characters
              </span>
            )}

            <input
              className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
              type="submit"
            />
            {apiErr ? (
              <p className="text-rose-600 font-bold">{apiErr}</p>
            ) : null}
          </form>
        </>
      ) : (
        <p>You need to be a community admin to edit the community.</p>
      )}
    </>
  );
};

export default CommunityNewForm;
