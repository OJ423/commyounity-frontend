import { getUserAdmins, getUserMemberships, joinUser, leaveUser } from "@/utils/apiCalls";
import { useAuth } from "./context/AuthContext"
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CommunitiesLocalStorage, CommunityProfile, UserJoinInputs, JoinedCommunityResponse } from "@/utils/customTypes";
import Link from "next/link";
import StopUsingCommunity from "./community-membership/StopUsingCommunity";
import { LogUserOut } from "@/utils/logOut";
import LeaveCommButton from "./community-membership/LeaveCommButton";
import SwitchCommunityButton from "./community-membership/SwitchCommunityButton";
import JoinCommBtn from "./community-membership/JoinCommBtn";

interface CommunityButtonLogicProps {
  communityMember: boolean,
  setCommunityMember: React.Dispatch<React.SetStateAction<boolean>>,
  setCommunityData: React.Dispatch<React.SetStateAction<CommunityProfile | null>>,
}

const CommunityButtonLogic: React.FC<CommunityButtonLogicProps> = ({communityMember, setCommunityMember, setCommunityData}) => {
  const { user, setUser, token, setToken, selectedCommunity, setSelectedCommunity, communities, setCommunities, userMemberships, setUserMemberships, setUserPostLikes, userAdmins, setUserAdmins } = useAuth()

  const router = useRouter()

  const searchParams = useSearchParams()
  const community_id = searchParams.get('community')
  // Type guard for rendered checks
  const isDefined = (value: any): value is string => value !== null && value !== undefined;
  const isSelected = isDefined(community_id) && selectedCommunity?.community_id === +community_id;

  const params = useParams<{community: string}>()

  function resetData() {
    setCommunityData(null)
  }

  return(
    <>
    {user ?
      communityMember ?
        isSelected ?
        <div className="flex justify-between flex-wrap items-center gap-2 mt-8">
          <div className="flex gap-4">
            <StopUsingCommunity />
            <Link href="/communities/" onClick={resetData} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Communities</span>
            </Link>
          </div>
          <LeaveCommButton community_id={community_id} setCommunityMember={setCommunityMember} />
        </div>
        :
        <div className="flex justify-between items-center gap-2 mt-8 flex-wrap">
          <div className="flex gap-4">
            <SwitchCommunityButton community_id={community_id} community_name={params.community} communityMember={communityMember} />
            <Link href="/communities/" onClick={resetData} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Communities</span>
            </Link>
          </div>
          <LeaveCommButton community_id={community_id} setCommunityMember={setCommunityMember} />
        </div>
        :
        <div className="flex gap-4 mt-8">
          <JoinCommBtn community_id={community_id} setCommunityMember={setCommunityMember} />
          <Link href="/communities/" onClick={resetData} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
            <span>Communities</span>
          </Link>
        </div>
        :
        <div className="mt-8">
          <Link  href='/login' className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
            <span>Login/Register To Join</span>
          </Link>
        </div>
    }
    </>
  )
}

export default CommunityButtonLogic