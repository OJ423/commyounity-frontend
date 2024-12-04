import { BlockedUser, Community } from "@/utils/customTypes";
import { useState } from "react";
import { formatShortDate } from "@/utils/dataTransformers";
import Image from "next/image";
import { unblockUser } from "@/utils/apiCalls";
import { useAuth } from "./context/AuthContext";

interface CommunityBlockedUserCardProps {
  blockedUser: BlockedUser;
  community: Community;
  invalidTokenResponse: () => void;
}

const CommunityBlockedUserCard: React.FC<CommunityBlockedUserCardProps> = ({
  blockedUser,
  community,
  invalidTokenResponse,
}) => {

  const [apiErr, setApiErr] = useState<string | null>(null)
  const {token, setToken} = useAuth()

  const handleUnblockUser = async () => {
    try {
      const response = await unblockUser(community.community_id, blockedUser.user_id, token);
      setToken(response.token);
      localStorage.setItem("token", response.token)
    }
    catch(error:any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error updating your profile, please try again.`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  }

  return (
    <>
      <section className="p-4 rounded-lg bg-indigo-100 flex flex-col gap-4 sm:flex-row gap-8 lg:gap-20 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {blockedUser.user_avatar ? (
            <div className="w-16 h-16 me-auto">
              <Image
                src={blockedUser.user_avatar}
                alt={`${blockedUser.username} avatar`}
                width={96}
                height={96}
                quality={60}
                className="rounded-full object-cover w-12 h-12"
              />
            </div>
          ) : null}
          <div className="grid grid-cols-2 lg:grid-cols-3 items-center gap-4 w-full">
            <div className="flex flex-col gap-2">
              <p className="font-bold">{blockedUser.username}</p>
              {blockedUser.reason ? (
                <p className="font-semibold text-sm">Reason:</p>
              ) : null}
              <p className="font-light text-sm">{blockedUser.reason}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-light uppercase text-xs text-indigo-500">
                Account Created On:
              </p>
              <p className="font-bold text-sm">
                {formatShortDate(blockedUser.date_joined)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-light uppercase text-xs text-indigo-500">Blocked On:</p>
              <p className="font-bold text-sm">
                {formatShortDate(blockedUser.created_at)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleUnblockUser}
          className="text-xs w-max border-solid border-4 border-black py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out ms-auto"
        >
          Unblock
        </button>
      </section>
      {apiErr ?
      <p className="font-bold text-red-500"></p>
      : null}
    </>
  );
};

export default CommunityBlockedUserCard;
