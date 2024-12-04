import { removeCommunityAdmin } from "@/utils/apiCalls";
import { AdminsLists, Community } from "@/utils/customTypes";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";

interface CommunityAdminCardProps {
  admin: AdminsLists;
  community: Community;
  invalidTokenResponse: () => void;
}

const CommunityAdminCard: React.FC<CommunityAdminCardProps> = ({
  admin,
  community,
  invalidTokenResponse,
}) => {

  const {token, setToken} = useAuth();

  const handleRemoveAdmin = async () => {
    try {
      const response = await removeCommunityAdmin(token, community.community_id, admin.user_id);
      setToken(response.token)
      localStorage.setItem("token", response.token)
    }
    catch(error:any) {
      console.error("There is an API error:", error)
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse()
      }
    }
}


  return (
    <>
      <section className="p-4 rounded-lg bg-indigo-100 flex gap-4 md:gap-8 lg:gap-20 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {admin.user_avatar ? (
            <div className="w-20 me-auto">
              <Image
                src={admin.user_avatar}
                alt={`${admin.username} avatar`}
                width={96}
                height={96}
                quality={60}
                className="rounded-full object-cover w-14 h-14"
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <p className="font-bold">{admin.username}</p>
          </div>
        </div>
        <button
          onClick={handleRemoveAdmin}
          className="text-xs w-max border-solid border-4 border-black py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
        >
          Remove
        </button>
      </section>
    </>
  );
};

export default CommunityAdminCard;