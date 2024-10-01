import {
  BusinessAdmin,
  ChurchAdmin,
  CommunityAdmin,
  GroupAdmin,
  SchoolAdmin,
} from "@/utils/customTypes";
import { LogUserOut } from "@/utils/logOut";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { getEntityAdmins } from "@/utils/apiCalls";
import AdminUserCard from "./AdminUserCard";
import AdminUserNew from "./AdminUserForm";

interface AdminUserListProps {
  type: string;
  entityId: number | undefined;
  entityName: string | undefined;
  owner: boolean;
  handleShowUserAdmins: () => void;
}

const AdminUserList: React.FC<AdminUserListProps> = ({ type, entityId, entityName, owner, handleShowUserAdmins }) => {
  
  const [admins, setAdmins] = useState<
    | BusinessAdmin[]
    | GroupAdmin[]
    | ChurchAdmin[]
    | SchoolAdmin[]
    | CommunityAdmin[]
    | null
  >(null);

  const {
    token,
    setToken,
    setUserAdmins,
    setCommunities,
    setSelectedCommunity,
    setUser,
    setUserMemberships,
    setUserPostLikes,
  } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEntityAdmins(type, entityId, token);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setAdmins(data.adminUsers)
      } catch (error: any) {
        console.error("There was an error:", error);
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
    };
    fetchData()
  }, [token, entityId, type]);

  return (
    <>
    {owner && admins ?
      <>
      <section className="flex flex-col gap-4 w-full">
        <button 
          className="text-xs w-max border-solid border-4 border-gray-500 text-gray-500 p-2 inline-block rounded-xl uppercase font-semibold hover:bg-gray-500 hover:border-gray-500 hover:text-white transition-all duration-500 ease-out"
          onClick={handleShowUserAdmins}
        >
          {`<< Back to posts`}
        </button>
        <h2 className="font-semibold text-xl">Admin Users for {entityName}</h2>
        <p>See below for a list of administrators who can edit {entityName} and delete posts and comments from other members.</p>
        {admins.map((person) => (
          <AdminUserCard adminUser={person} entityId={entityId} key={person.user_id} type={type} />
        ))}
      </section>
      <section className="flex flex-col gap-4 w-full mt-20">
        <h2 className="font-semibold text-xl">Add admin</h2>
        <p>Fill in the form below to add a new administrator. Please note that they need to be registered in order be added.</p>
        <AdminUserNew type={type} entityId={entityId} />
      </section>
      </>
      : 
      <section className="flex flex-col gap-4 w-full mt-8">
        <h2 className="font-semibold text-lg">You need to be an administrator</h2>
        <p>You are not authorised to see this section.</p>
      </section>
    }
    </>
  );
};

export default AdminUserList;
