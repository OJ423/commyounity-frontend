import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { ChurchJoinResponse, GroupJoinResponse } from "@/utils/customTypes";
import { getUserMemberships, joinUser, leaveUser } from "@/utils/apiCalls";
import { usePathname, useRouter } from "next/navigation";
import { LogUserOut } from "@/utils/logOut";
import { useEffect } from "react";

type ButtonProps = {
  member: boolean;
  setMember: React.Dispatch<React.SetStateAction<boolean>>;
  owner: boolean;
  setOwner: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  id: number | undefined;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const MembershipButtonLogic: React.FC<ButtonProps> = ({
  member,
  setMember,
  owner,
  setOwner,
  type,
  id,
  showForm,
  setShowForm
}) => {
  const {
    user,
    setUser,
    userMemberships,
    userAdmins,
    setCommunities,
    selectedCommunity,
    setSelectedCommunity,
    setUserMemberships,
    token,
    setToken,
    setUserPostLikes,
    setUserAdmins,
  } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const invalidTokenResponse = (): void => {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
    });
    router.push("/login");
  };

  async function setMemberships(
    user_id: number | undefined,
    communityId: number,
    token: string | null
  ) {
    try {
      if (user) {
        const memberships = await getUserMemberships(
          user_id,
          communityId,
          token
        );
        setUserMemberships(memberships);
        localStorage.setItem("userMemberships", JSON.stringify(memberships));
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error);
    }
  }

  async function handleJoin() {
    try {
      if (id && user) {
        const fetchData: any = await joinUser(
          user.user_id,
          String(id),
          type,
          token
        );
        setMember(true);
        const savedMemberships: string | null =
          localStorage.getItem("userMemberships");
        if (savedMemberships) {
          const parsedMemberships = JSON.parse(savedMemberships);
          if (type === "group") {
            parsedMemberships.userMemberships.groups.push(fetchData.group);
          }
          if (type === "church") {
            parsedMemberships.userMemberships.churches.push(fetchData.church);
          }
          localStorage.setItem(
            "userMemberships",
            JSON.stringify(parsedMemberships)
          );
          setUserMemberships(parsedMemberships);
        }
      }
    } catch (error: any) {
      if (error.response) {
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          invalidTokenResponse();
        }
      }
      console.log(error);
    }
  }

  async function handleLeave() {
    try {
      if (user && selectedCommunity) {
        const deleteCall = await leaveUser(
          user.user_id,
          String(id),
          type,
          token
        );
        await setMemberships(
          +user.user_id,
          selectedCommunity?.community_id,
          token
        );
        setMember(false);
      }
    } catch (error: any) {
      if (error.response) {
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          invalidTokenResponse();
        }
      }
      console.log(error);
    }
  }

  function handleEdit() {
    setShowForm(!showForm)
  }


  useEffect(() => {
    const idToCheck = pathname.split("/").pop();
    let isMember = false;
    let isOwner = false;
    if (userMemberships) {

      if (pathname.includes("groups")) {
        isMember = userMemberships.userMemberships.groups.some(
          (g) => g && String(g.group_id) === idToCheck
        );
      } else if (pathname.includes("churches")) {
        isMember = userMemberships.userMemberships.churches.some(
          (c) => c && String(c.church_id) === idToCheck
        );
      }
      setMember(isMember);
    }
    if (userAdmins) {
      if (pathname.includes("groups")) {
        isOwner = userAdmins?.groups.some(
          (g) => g && String(g.group_id) === idToCheck
        )
      }
      if (pathname.includes("churches")) {
        isOwner = userAdmins?.churches.some(
          (c) => c && String(c.church_id) === idToCheck
        )
      }
      if (pathname.includes("businesses")) {
        isOwner = userAdmins?.businesses.some(
          (b) => b && String(b.business_id) === idToCheck
        )
      }
      if (pathname.includes("schools")) {
        isOwner = userAdmins?.schools.some(
          (s) => s && String(s.school_id) === idToCheck
        )
      }
      setOwner(isOwner)
    }
  }, [userMemberships, userAdmins, pathname, setMember, setOwner]);


  return (
    <>
      {user ? (
        <>
          {type === "business" ? null : (
            <>
              {!member ? (
                <button
                  onClick={handleJoin}
                  className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
                >
                  <span>Join</span>
                </button>
              ) : (
                <div className="flex gap-4 items-center flex-wrap justify-between w-full">
                  <p className="text-xs font-bold p-3 rounded-xl bg-indigo-300">
                    You are a member
                  </p>
                  <button
                    onClick={handleLeave}
                    className="w-max border-solid border-4 border-rose-600 text-rose-600 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out"
                  >
                    <span>Leave</span>
                  </button>
                </div>
              )}
            </>
          )}
          { owner ? 
          <section className="w-full flex flex-col gap-4 mt-8">
            <h3 className="uppercase text-gray-500 text-xs font-bold pb-4 border-b-2">Admin zone:</h3>
            <p className="text-sm">Edit your {type} or delete it. If deleting, bear in mind other users will no longer be able to use this group and all posts and comments will be deleted forever!</p>
            <div className="flex items-center gap-8">
              <button onClick={handleEdit} className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
                Edit
              </button>
              <button className="w-max border-solid border-4 border-rose-600 text-rose-600 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out">
                Delete
              </button>
            </div>

          </section>
          : null
          }
        </>
      ) : null}
    </>
  );
};

export default MembershipButtonLogic;
