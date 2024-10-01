import { removeAdmin } from "@/utils/apiCalls";
import {
  BusinessAdmin,
  ChurchAdmin,
  CommunityAdmin,
  GroupAdmin,
  SchoolAdmin,
} from "@/utils/customTypes";
import { useAuth } from "./context/AuthContext";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";

export interface AdminUserCardProps {
  adminUser:
    | BusinessAdmin
    | GroupAdmin
    | ChurchAdmin
    | SchoolAdmin
    | CommunityAdmin;
  entityId: number | undefined;
  type: string;
}

const AdminUserCard: React.FC<AdminUserCardProps> = ({ adminUser, entityId, type }) => {
  
  const {token,
    setToken,
    setUserAdmins,
    setCommunities,
    setSelectedCommunity,
    setUser,
    setUserMemberships,
    setUserPostLikes,} = useAuth()

    const router = useRouter();

  const handleRemoveAdmin = async () => {
    try {
      const data = await removeAdmin(token, entityId, type, adminUser.user_id)
      setToken(data.token)
      localStorage.setItem("token", data.token)
    }
    catch(error:any) {
      console.error("Error removing admin:", error)
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          LogUserOut({
            setToken,
            setUserAdmins,
            setCommunities,
            setSelectedCommunity,
            setUser,
            setUserMemberships,
            setUserPostLikes,
          });
          router.push("/login");
        }
    }
  }
  return (
    <div className="flex items-center justify-between gap-8 py-4 px-8 rounded-lg mt-4 border-indigo-200 border-4">
      <div className="flex items-center gap-8">
        <p className="font-bold">{adminUser.username}</p>
        <p className="font-light">{adminUser.user_email}</p>
      </div>
      <button 
        onClick={handleRemoveAdmin}
        className="text-xs text-red-500 border-red-500 w-max border-solid border-4 p-2 inline-block rounded-xl uppercase font-semibold hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 ease-out"
      >
        Remove
      </button>
    </div>
  );
};

export default AdminUserCard;
