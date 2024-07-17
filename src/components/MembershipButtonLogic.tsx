import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { GroupJoinResponse } from "@/utils/customTypes";
import { getUserMemberships, joinUser, leaveUser } from "@/utils/apiCalls";
import { useRouter } from "next/navigation";
import { LogUserOut } from "@/utils/logOut";

type ButtonProps = {
  member: boolean;
  setMember: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  id: number | undefined;
};

const MembershipButtonLogic: React.FC<ButtonProps> = ({
  member,
  setMember,
  type,
  id,
}) => {
  const {
    user,
    setUser,
    userMemberships,
    setCommunities,
    selectedCommunity,
    setSelectedCommunity,
    setUserMemberships,
    token,
    setToken,
    setUserPostLikes,
    setUserAdmins
  } = useAuth();
  const router = useRouter();

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


  async function setMemberships(user_id: number | undefined, communityId:number, token: string | null) {
    try{
      if (user) {
        const memberships = await getUserMemberships(user_id, communityId, token);
        setUserMemberships(memberships);
        localStorage.setItem('userMemberships', JSON.stringify(memberships));
      }
    } catch(error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log(error.response.data.msg)
    }
  }

  async function handleJoin() {
    try {
      if (id && user) {
        const fetchData: GroupJoinResponse = await joinUser(
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
          parsedMemberships.userMemberships.groups.push(fetchData.group);
          localStorage.setItem("userMemberships", JSON.stringify(parsedMemberships));
          setUserMemberships(parsedMemberships)
        }
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error.response.data.msg);
    }
  }

  async function handleLeave() {
    try {
      if (user && selectedCommunity) {
        const deleteCall = await leaveUser(user.user_id, String(id), type, token);
        await setMemberships(+user.user_id, selectedCommunity?.community_id, token);
        setMember(false);
      }
    } catch(error:any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error.response.data.msg);
    }
  }


  return (
    <>
    {user ?
    <>
      {type === "business" ?
      null
      :
       <> 
      {!member ? (
        <Link
          href="" onClick={handleJoin}
          className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
        >
          <span>Join</span>
        </Link>
      ) : (
        <div className="flex gap-4 items-center flex-wrap justify-between w-full">
          <p className="text-xs font-bold p-3 rounded-xl bg-indigo-300">
            You are a member
          </p>
          <Link onClick={handleLeave}
            href=""
            className="w-max border-solid border-4 border-rose-600 text-rose-600 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out"
          >
            <span>Leave</span>
          </Link>
        </div>
      )}
      </>
    }
    </>
  : null
  }
  </>
  );
};

export default MembershipButtonLogic
