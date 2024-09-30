
interface Context {
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  setCommunities: (communities: any[]) => void;
  setSelectedCommunity: (community: any | null) => void;
  setUserMemberships: (memberships: any | null) => void;
  setUserAdmins: (admins: any | null) => void;
  setUserPostLikes: (postLikes: any | null) => void;
}


export const LogUserOut = ({
  setToken,
  setUser,
  setCommunities,
  setSelectedCommunity,
  setUserMemberships,
  setUserAdmins,
  setUserPostLikes,
}: Context): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('communities');
  localStorage.removeItem('selectedCommunity');
  localStorage.removeItem('userMemberships');
  localStorage.removeItem('userAdmins');
  localStorage.removeItem('userPostLikes');
  setToken(null);
  setUser(null);
  setCommunities([]);
  setSelectedCommunity(null);
  setUserMemberships(null);
  setUserAdmins(null);
  setUserPostLikes(null)
};