import { AdminsLists, Community, Members } from "@/utils/customTypes";
import FormDrawer from "./FormDrawer";
import { useEffect, useState } from "react";
import CommunityBlockUser from "./CommunityBlockUser";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import { postCommunityAdminById } from "@/utils/apiCalls";

interface CommunityMemberCardProps {
  member: Members;
  community: Community;
  admins: AdminsLists[] | [];
  invalidTokenResponse: () => void;
}

const CommunityMemberCard: React.FC<CommunityMemberCardProps> = ({
  member,
  community,
  admins,
  invalidTokenResponse,
}) => {
  const { token, setToken } = useAuth();

  const [apiErr, setApiErr] = useState<string | null>(null);
  const [existingAdmin, setExistingAdmin] = useState<boolean>(false);

  const [showForm, setShowForm] = useState<boolean>(false);
  const handleDisplayForm = () => {
    setShowForm(!showForm);
  };

  const handleAddAdmin = async () => {
    try {
      setApiErr(null);
      const body = {
        community_id: community.community_id,
        user_id: member.user_id,
      };
      const response = await postCommunityAdminById(token, body);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setApiErr("User now an admin");
    } catch (error: any) {
      console.log(
        "There has been an error fetching the community members",
        error
      );
      if (error.response.data.msg === "Community already exists.") {
        setApiErr("Already an admin");
      }
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  };

  useEffect(() => {
    const adminCheck = admins.some((admin) => admin.user_id === member.user_id);
    setExistingAdmin(adminCheck);
  }, [member, token, admins]);

  return (
    <>
      <section className="p-4 rounded-lg bg-indigo-100 flex gap-4 md:gap-8 lg:gap-20 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {member.user_avatar ? (
            <div className="w-20 me-auto">
              <Image
                src={member.user_avatar}
                alt={`${member.username} avatar`}
                width={96}
                height={96}
                quality={60}
                className="rounded-full object-cover w-14 h-14"
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <p className="font-bold">{member.username}</p>
            <p className="font-light text-sm">{member.user_bio}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {existingAdmin ? (
            <p className="text-green-500 font-bold">Admin</p>
          ) : (
            <button
              onClick={handleAddAdmin}
              className="text-xs w-max border-solid border-4 border-black py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
            >
              Make Admin
            </button>
          )}
          <button
            onClick={handleDisplayForm}
            className="text-xs w-max border-solid border-4 border-red-500 text-red-500 py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 ease-out"
          >
            Block
          </button>
        </div>
      </section>
      {apiErr ? <p className="font-bold text-green-500">{apiErr}</p> : null}
      <FormDrawer
        showForm={showForm}
        setShowForm={setShowForm}
        handleDisplayForm={handleDisplayForm}
      >
        <h2 className="text-xl font-bold">
          Why do you want to block this user?
        </h2>
        <CommunityBlockUser
          community_id={community.community_id}
          username={member.username}
          handleDisplayForm={handleDisplayForm}
          invalidTokenResponse={invalidTokenResponse}
        />
      </FormDrawer>
    </>
  );
};

export default CommunityMemberCard;
