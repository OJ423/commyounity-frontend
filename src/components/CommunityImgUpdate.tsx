"use client";

import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { patchCommunity } from "@/utils/apiCalls";
import { handleUpload } from "@/utils/blobFuncs";
import { Community, UnsplashImage } from "@/utils/customTypes";
import UnsplashImgSearch from "./UnplashImgSearch";

interface CommunityImgUpdateProps {
  owner: boolean;
  invalidTokenResponse: () => void;
  handleDisplayForm: (value: string) => void;
  community: Community;
}

const CommunityImgUpdate: React.FC<CommunityImgUpdateProps> = ({
  owner,
  invalidTokenResponse,
  community,
  handleDisplayForm,
}) => {
  const { user, token, setToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [apiErr, setApiErr] = useState<string | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleCommunityUpdate = async () => {
    try {
      let imageUrl = community.community_img;
      if (file) {
        imageUrl = await handleUpload(file, token, community.community_img);
      } else if (selectedImage.length > 0) {
        imageUrl = selectedImage;
      }
      const body = { community_img: imageUrl };
      const response = await patchCommunity(
        community.community_id,
        user?.user_id,
        token,
        body
      );
      setToken(response.token);
      localStorage.setItem("token", response.token);
      handleDisplayForm("edit");
      setFile(null);
    } catch (error: any) {
      console.error("Error:", error);
      setApiErr("Something went wrong uploading the image.");
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  };

  return (
    <>
      {owner ? (
        <div>
          <h2 className="text-2xl font-bold mb-8">Change the image</h2>
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
          <div className="flex flex-col p-4 border-2 border-indigo-500 mb-8">
            {imageInsertType === "upload" ? (
              <div className="flex flex-col gap-4">
                <p>Choose a file from your device.</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file:px-4 file:py-2 file:transition-all file:duration-500 file:me-4 file:cursor-pointer"
                />
                <button
                  className="px-4 py-2 bg-indigo-500 w-fit rounded text-white transition-all duration-500 hover:bg-indigo-200 hover:text-indigo-800"
                  onClick={handleCommunityUpdate}
                >
                  Upload
                </button>
              </div>
            ) : imageInsertType === "unsplash" ? (
              <>
                <UnsplashImgSearch
                  onSelectImage={handleImageSelect}
                  images={images}
                  setImages={setImages}
                  imageConfirm={imageConfirm}
                />
                <button
                  className="px-4 py-2 bg-indigo-500 w-fit rounded text-white transition-all duration-500 hover:bg-indigo-200 hover:text-indigo-800"
                  onClick={handleCommunityUpdate}
                >
                  Confirm
                </button>
              </>
            ) : null}
          </div>
          {apiErr ? <p className="text-rose-500">{apiErr}</p> : null}
        </div>
      ) : null}
    </>
  );
};

export default CommunityImgUpdate;
