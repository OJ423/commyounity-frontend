import { Community } from "@/utils/customTypes";
import { useState } from "react";
import CommunityMembersList from "./CommunityMembersList";

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

  return (
    <>
      <div className="max-w-screen-lg w-full">
        <button className="text-sm font-bold mt-8 text-indigo-500 transition-all duration-500 hover:text-gray-500 me-auto" onClick={handleShowUserManagement}>
          {`<< Back to Community`}
        </button>
      </div>
      <section className="max-w-screen-lg flex flex-col gap-4 my-8 p-4">
        <h1 className="text-2xl lg:text-3xl font-bold mb-20 text-center">
          {community.community_name} User Management
        </h1>
        <div className="w-full rounded-lg p-8 bg-white border-t-4 border-indigo-500">
          <div className="flex items-center -mt-20 justify-center gap-4 mb-12">
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
