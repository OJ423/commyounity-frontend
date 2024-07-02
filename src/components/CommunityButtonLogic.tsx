import { joinCommunity, leaveCommunity } from "@/utils/apiCalls";
import { useAuth } from "./context/AuthContext"
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CommunityProfile, JoinCommunityInputs, JoinedCommunityResponse } from "@/utils/customTypes";
import Link from "next/link";

interface CommunityButtonLogicProps {
  communityMember: boolean,
  setCommunityMember: React.Dispatch<React.SetStateAction<boolean>>,
  setCommunityData: React.Dispatch<React.SetStateAction<CommunityProfile | null>>,
  communityData: CommunityProfile,
}

const CommunityButtonLogic: React.FC<CommunityButtonLogicProps> = ({communityMember, setCommunityMember, communityData, setCommunityData}) => {
  const { user, setUser, token, setToken, selectedCommunity, setSelectedCommunity, communities, setCommunities } = useAuth()

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

  function handleSwitchCommunity() {
    if (community_id && communityMember) {
      const chosenCommunity = {community_id: +community_id, community_name: params.community }
      setSelectedCommunity(chosenCommunity)
      localStorage.setItem('selectedCommunity', JSON.stringify(chosenCommunity));
    }
  }

  function handleStopUsingCommunity() {
      setSelectedCommunity(null)
      localStorage.removeItem('selectedCommunity');
  }

  const invalidTokenResponse = () :void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('communities')
    localStorage.removeItem('selectedCommunity')
    setToken(null);
    setUser(null)
    setCommunities([])
    setSelectedCommunity(null)
    router.push('/login')
  }

  async function handleJoinCommunity() {
    try {
      if (community_id && user) {
        const fetchBody: JoinCommunityInputs = {user_id: user?.user_id, community_id: community_id};
        const fetchData: JoinedCommunityResponse = await joinCommunity(fetchBody, token);
        setSelectedCommunity(fetchData.community);
        setCommunityMember(true);
        await setCommunities([
          ...communities,
          fetchData.community
        ]);
        localStorage.setItem('communities', JSON.stringify(communities))
        localStorage.setItem('selectedCommunity', JSON.stringify(fetchData.community))
      }
    } catch (error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log(error.response.data.msg)
    }
  }

  async function handleLeaveCommunity() {
    try {
      if (community_id && user) {
        const deleteCall = await leaveCommunity(user.user_id, community_id, token);
        setCommunityMember(false);
        setSelectedCommunity(null);
        await setCommunities(
          communities.filter(c => String(c.community_id) !== community_id)
        )
        localStorage.setItem('communities', JSON.stringify(communities))
      }
    } catch (error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log(error.response.data.msg)
    }
  }

  return(
    <>
    {user ?
      communityMember ?
        isSelected ?
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-4">
            <Link  href="" onClick={handleStopUsingCommunity} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Jump Out</span>
            </Link>
            <Link href="/communities/" onClick={resetData} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Communities</span>
            </Link>
          </div>
          <Link  href="" onClick={handleLeaveCommunity} className="border-solid border-4 border-rose-600 text-rose-600 py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out">
            <span>Leave</span>
          </Link>
        </div>
        :
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-4">
            <Link  href="" onClick={handleSwitchCommunity} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Jump In</span>
            </Link>
            <Link href="/communities/" onClick={resetData} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Communities</span>
            </Link>
          </div>
          <Link  href="" onClick={handleLeaveCommunity} className="border-solid border-4 border-rose-600 text-rose-600 py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out">
            <span>Leave</span>
          </Link>
        </div>
        :
        <div className="flex gap-4">
          <Link href="" onClick={handleJoinCommunity} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
            <span>Join</span>
          </Link>
          <Link href="/communities/" onClick={resetData} className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
            <span>Communities</span>
          </Link>
        </div>
        :
        <div>
          <Link  href='/login' className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
            <span>Login/Register To Join</span>
          </Link>
        </div>
    }
    </>
  )
}

export default CommunityButtonLogic