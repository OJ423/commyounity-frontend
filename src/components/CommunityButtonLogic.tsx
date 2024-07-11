import { getUserAdmins, getUserMemberships, joinUser, leaveUser } from "@/utils/apiCalls";
import { useAuth } from "./context/AuthContext"
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CommunitiesLocalStorage, CommunityProfile, UserJoinInputs, JoinedCommunityResponse } from "@/utils/customTypes";
import Link from "next/link";

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

  async function setMemberships(user_id: number | undefined, communityId:number) {
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

  async function setAdmins(user_id: number | undefined, communityId:number) {
    try{
      if (user) {
        const admins = await getUserAdmins(user_id, communityId, token);
        setUserAdmins(admins);
        localStorage.setItem('userAdmins', JSON.stringify(admins));
      }
    } catch(error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log(error.response.data.msg)
    }
  }

  async function handleSwitchCommunity() {
    try {
      if (community_id && communityMember) {
        const chosenCommunity = {community_id: +community_id, community_name: params.community }
        setSelectedCommunity(chosenCommunity)
        if(user) {
          setMemberships(+user?.user_id, +community_id);
          setAdmins(+user?.user_id, +community_id)
        }
        localStorage.setItem('selectedCommunity', JSON.stringify(chosenCommunity));
      }
    } catch(error:any) {
      console.log(error)
    } finally {
    }
  }

  function handleStopUsingCommunity() {
    localStorage.removeItem('selectedCommunity');
    localStorage.removeItem('selectedCommunity')
    localStorage.removeItem('userMemberships')
    localStorage.removeItem('userAdmins')
    localStorage.removeItem('userPostLikes')
    setSelectedCommunity(null)
    setUserMemberships(null)
    setUserAdmins(null)
    setUserPostLikes([])
  }

  const invalidTokenResponse = () :void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('communities')
    localStorage.removeItem('selectedCommunity')
    localStorage.removeItem('userMemberships')
    localStorage.removeItem('userAdmins')
    localStorage.removeItem('userPostLikes')
    setToken(null);
    setUser(null)
    setCommunities([])
    setSelectedCommunity(null)
    setUserMemberships(null)
    setUserAdmins(null)
    setUserPostLikes([])
    router.push('/login')
  }

  async function handleJoin() {
    try {
      if (community_id && user) {
        const fetchData: JoinedCommunityResponse = await joinUser(user.user_id, community_id, "community", token);
        setSelectedCommunity(fetchData.community);
        setCommunityMember(true);
        setMemberships(+user?.user_id, +community_id);
        setAdmins(+user?.user_id, +community_id);
        setCommunities([
          ...communities,
          fetchData.community
        ]);
        localStorage.setItem('communities', JSON.stringify(communities))
        localStorage.setItem('selectedCommunity', JSON.stringify(fetchData.community))
        const savedCommunityMembership: string | null = localStorage.getItem('communities')
        if (savedCommunityMembership) {
          const parsedCommunityMembers = JSON.parse(savedCommunityMembership)
          parsedCommunityMembers.push(fetchData.community)
          localStorage.setItem('communities', JSON.stringify(parsedCommunityMembers))
        }
      }
    } catch (error:any) {
      if (error.response.data.msg === 'Authorization header missing' || error.response.data.msg === 'Invalid or expired token') {
        invalidTokenResponse()
      }
      console.log(error.response.data.msg)
    }
  }

  async function handleLeave() {
    try {
      if (community_id && user) {
        const deleteCall = await leaveUser(user.user_id, community_id, "community", token);
        setCommunityMember(false);
        setSelectedCommunity(null);
        setCommunities(
          communities.filter(c => String(c.community_id) !== community_id)
        )
        localStorage.setItem('communities', JSON.stringify(communities))
        const savedCommunityMembership: string | null = localStorage.getItem('communities')
        if (savedCommunityMembership) {
          const parsedCommunityMembers: CommunitiesLocalStorage[] = JSON.parse(savedCommunityMembership)
          const updatedCommunities:CommunitiesLocalStorage[] = parsedCommunityMembers.filter(c => String(c.community_id) !== community_id)
          localStorage.setItem('communities', JSON.stringify(updatedCommunities))
        }
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
        <div className="flex justify-between flex-wrap items-center gap-2 mt-8">
          <div className="flex gap-4">
            <Link  href="" onClick={handleStopUsingCommunity} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Jump Out</span>
            </Link>
            <Link href="/communities/" onClick={resetData} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Communities</span>
            </Link>
          </div>
          <Link  href="" onClick={handleLeave} className="text-xs border-solid border-4 border-rose-600 text-rose-600 py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out">
            <span>Leave</span>
          </Link>
        </div>
        :
        <div className="flex justify-between items-center gap-2 mt-8 flex-wrap">
          <div className="flex gap-4">
            <Link  href="" onClick={handleSwitchCommunity} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Jump In</span>
            </Link>
            <Link href="/communities/" onClick={resetData} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
              <span>Communities</span>
            </Link>
          </div>
          <Link  href="" onClick={handleLeave} className="text-xs border-solid border-4 border-rose-600 text-rose-600 py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all duration-500 ease-out">
            <span>Leave</span>
          </Link>
        </div>
        :
        <div className="flex gap-4 mt-8">
          <Link href="" onClick={handleJoin} className="text-xs border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
            <span>Join</span>
          </Link>
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