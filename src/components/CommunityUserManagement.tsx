import { AdminsLists, Community, Members } from "@/utils/customTypes";
import { useEffect, useState } from "react";
import CommunityMembersList from "./CommunityMembersList";
import CommunityBlockedUsersList from "./CommunityBlockedUsersList";
import CommunityAdminList from "./CommunityAdminList";
import { getCommunityAdmins, getCommunityMembers } from "@/utils/apiCalls";
import { useAuth } from "./context/AuthContext";

interface CommunityUserManagementProps {
  community: Community;
  owner: boolean;
  handleShowUserManagement: () => void;
  invalidTokenResponse:() => void;
}

const CommunityUserManagement: React.FC<CommunityUserManagementProps> = ({
  community,
  owner,
  handleShowUserManagement,
  invalidTokenResponse
}) => {

  const [userType, setUserType] = useState<string>("members");
  const [members, setMembers] = useState<Members[] | []>([]);
  const [admins, setAdmins] = useState<AdminsLists[] | []>([]);
  const {token, setToken} = useAuth();


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getCommunityMembers(token, community.community_id);
        setToken(data.token);
        localStorage.setItem("token", data.token)
        setMembers(data.members)
      }
      catch(error:any) {
        console.log("There has been an error fetching the community members", error);
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          invalidTokenResponse()
        }
      }
    }

    const fetchAdmins = async () => {
      try {
        const data = await getCommunityAdmins(community.community_id, token);
        setToken(data.token);
        localStorage.setItem("token", data.token)
        setAdmins(data.communityAdmins)
      }
      catch(error:any) {
        console.log("There has been an error fetching the community members", error);
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          invalidTokenResponse()
        }
      }
    }
    fetchMembers()
    fetchAdmins()
  }, [token, community])

  return (
    <>
      <div className="max-w-screen-lg w-full">
        <button className="text-sm font-bold mt-4 md:mt-8 text-indigo-500 transition-all duration-500 hover:text-gray-500 me-auto" onClick={handleShowUserManagement}>
          {`<< Back to Community`}
        </button>
      </div>
      <section className="max-w-screen-lg flex flex-col gap-4 my-4 p-4">
        <h1 className="text-2xl lg:text-3xl font-bold mb-20 text-center">
          {community.community_name} <span className="text-indigo-500">User Management</span>
        </h1>
        <div className="w-full rounded-lg p-4 md:p-8 bg-white border-t-4 border-indigo-500">
          <div className="flex items-center -mt-16 md:-mt-20 justify-center gap-4 mb-12">
            <button
              onClick={() => setUserType("members")}
              className={`${
                userType === "members"
                  ? "text-indigo-500 bg-gradient-to-t from-white to-indigo-200"
                  : ""
              } rounded-t-lg font-bold text-sm uppercase border-t-4 border-x-4 border-indigo-500 bg-white p-4 text-bold transition-all duration-500  hover:text-gray-500`}
            >
              Members
            </button>
            <button
              onClick={() => setUserType("blocked")}
              className={`${
                userType === "blocked"
                  ? "text-indigo-500 bg-gradient-to-t from-white to-indigo-200"
                  : ""
              } rounded-t-lg font-bold text-sm uppercase border-t-4 border-x-4 border-indigo-500 bg-white p-4 text-bold transition-all duration-500  hover:text-gray-500`}
            >
              Blocked
            </button>
            <button
              onClick={() => setUserType("admins")}
              className={`${
                userType === "admins"
                  ? "text-indigo-500 bg-gradient-to-t from-white to-indigo-200"
                  : ""
              } rounded-t-lg font-bold text-sm uppercase border-t-4 border-x-4 border-indigo-500 bg-white p-4 text-bold transition-all duration-500  hover:text-gray-500`}
            >
              Admins
            </button>
          </div>
          {userType === "members" ?
          <CommunityMembersList
            community={community}
            owner={owner}
            members={members}
            admins={admins}
            invalidTokenResponse={invalidTokenResponse}
          />
          : userType === "blocked" ?
          <CommunityBlockedUsersList 
            community={community}
            owner={owner}
            invalidTokenResponse={invalidTokenResponse}
          />
          : userType === "admins" ?
          <CommunityAdminList
            community={community}
            owner={owner}
            admins={admins}
            invalidTokenResponse={invalidTokenResponse}
          />
          : null
          }
        </div>
      </section>
    </>
  );
};

export default CommunityUserManagement;
