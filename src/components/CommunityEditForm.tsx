"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { Community } from "@/utils/customTypes";

import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { patchCommunity } from "@/utils/apiCalls";

interface CommunityEditFormProps {
  community: Community;
  owner: boolean;
  user_id: string | undefined;
  handleDisplayForm: (value:string) => void;
  invalidTokenResponse: () => void;
}

const CommunityEditForm: React.FC<CommunityEditFormProps> = ({
  community, owner, user_id, handleDisplayForm, invalidTokenResponse
}) => {
  const { token, setToken } = useAuth();

  const [apiErr, setApiErr] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Community>({
    defaultValues: {
      community_name: community.community_name,
      community_description: community.community_description
    },
  });

  useEffect(() => {
    if (community) {
      setValue("community_name", community.community_name);
      setValue("community_description", community.community_description);
    }
  }, [setValue, community]);

  const onSubmit: SubmitHandler<Community> = async (data) => {
    try {
      const response = await patchCommunity(community.community_id, user_id, token, data)
      setToken(response.token)
      localStorage.setItem("token", response.token)
      handleDisplayForm("edit")
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error editing the community.`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse()
      }
    }
  };

  return (
    <>
      {owner ?
      <>
        <h2 className="font-bold text-2xl">Edit Community</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
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
              Community name is required and needs to be at least 5 characters.
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
          {watch("community_description").length > 900 ? (
            <span className="text-sm mb-4 text-rose-500 font-semibold">
              {watch("community_description") ? `${watch("community_description").length} characters` : null}
            </span>
          ) : null}

          <input
            className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
            type="submit"
          />
          {apiErr ? (
            <p className="text-rose-600 font-bold">{apiErr}</p>
          ) : null}
        </form>
      </>
      : <p>You need to be a community admin to edit the community.</p>
      }
    </>
  );
};

export default CommunityEditForm;
