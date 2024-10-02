"use client";

import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { patchCommunity } from "@/utils/apiCalls";
import { handleUpload } from "@/utils/blobFuncs";
import { Community } from "@/utils/customTypes";

interface CommunityImgUpdateProps {
  owner: boolean;
  invalidTokenResponse: () => void;
  handleDisplayForm: (value:string) => void;
  community: Community;
}

const CommunityImgUpdate: React.FC<CommunityImgUpdateProps> = ({
  owner,
  invalidTokenResponse,
  community,
  handleDisplayForm
}) => {
  const { user, token, setToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [apiErr, setApiErr] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleCommunityUpdate = async () => {
    try {
      const imageUrl = await handleUpload(file, token, community.community_img);
      const body = { community_img: imageUrl };
      const response = await patchCommunity(
        community.community_id,
        Number(user?.user_id),
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
        <>
            <h2 className="font-bold text-2xl">Upload new image</h2>
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
            {apiErr ? <p className="text-rose-500">{apiErr}</p> : null}
        </>
      ) : (
        null
      )}
    </>
  );
};

export default CommunityImgUpdate;
