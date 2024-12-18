import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getUserBio } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";

interface UserBioProps {
  username: string;
  member: boolean;
  showUserBio: boolean;
  handleShowUserBio: () => void;
}

const UserBio: React.FC<UserBioProps> = ({
  username,
  member,
  showUserBio,
  handleShowUserBio,
}) => {
  interface UserBio {
    username: string;
    user_bio: string;
    user_avatar: string;
  }
  const {
    token,
    setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setAdminCommunities,
  } = useAuth();
  const [userBio, setUserBio] = useState<UserBio>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserBio(username, token);
        setUserBio(response.userBio);
      } catch (error: any) {
        handleShowUserBio();
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          LogUserOut({
            setToken,
            setUser,
            setCommunities,
            setSelectedCommunity,
            setUserMemberships,
            setUserAdmins,
            setUserPostLikes,
            setAdminCommunities,
          });
        }
      }
    };
    fetchData();
  }, []);

  return (
    <section
      onClick={handleShowUserBio}
      className={`${
        !showUserBio ? "hidden opacity-0" : "block opacity-100"
      } flex items-center justify-center fixed top-0 left-0 min-w-screen min-h-screen transition-all duration-500 h-full top-0 right-0 fixed ease-in ease-out bg-black bg-opacity-50 z-20`}
    >
      {userBio && (
        <div className="flex flex-col gap-0 items-center max-w-sm bg-white p-0 rounded-lg flex-1 shadow-xl text-gray-800">
          <div className="w-full h-64 overflow-hidden relative">
            {userBio.user_avatar ? (
              <Image
                alt="User Avatar"
                src={userBio.user_avatar}
                width={200}
                height={200}
                className="object-cover w-full h-full rounded-t-lg"
              />
            ) : (
              <Image
                alt="User Avatar"
                src="/blank_user_avatar.png"
                width={200}
                height={200}
                className="object-cover w-full h-full rounded-t-lg"
              />
            )}
            <IoClose
              onClick={handleShowUserBio}
              size={32}
              className="absolute text-white bg-indigo-500 p-1 rounded absolute top-2 right-2 cursor-pointer"
            />
          </div>
          <div className="bg-indigo-500 w-full pt-1">
            <div className="w-full px-4 py-2 bg-indigo-200">
              <p className="text-gray-800 text-sm font-bold">
                {userBio?.username} user bio
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <p className="text-lg font-medium">{userBio.user_bio}.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserBio;
