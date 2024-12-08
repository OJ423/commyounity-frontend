import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

export default function ExpiredTokenMessage() {
  const {setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setAdminCommunities} = useAuth();

  useEffect(() => {
    setUser(null)
    localStorage.removeItem("user")
    setCommunities([])
    localStorage.removeItem("communities")
    setSelectedCommunity(null)
    localStorage.removeItem("selectedCommunity")
    setUserMemberships(null)
    localStorage.removeItem("userMemberships")
    setUserAdmins(null)
    localStorage.removeItem("userAdmins")
    setUserPostLikes([])
    localStorage.removeItem("userPostLikes")
    setAdminCommunities([])
    localStorage.removeItem("adminCommunities")
    setToken(null)
    localStorage.removeItem("token")
  }, [])

  return (
    <section className="max-w-screen-sm my-10 p-4 flex flex-col gap-4 justify center">
      <h2 className="font-bold text-3xl">Hmmm, something is amiss</h2>
      <p className="font-medium md:text-lg">It seems that this could be one of a number of things.</p>
      <ol className="ps-4 font-medium md:text-lg">
        <li className="list-decimal pb-4">
          You&apos;ve been away from the app for a while so your security token
          has expired. In which case, you need to login again.
        </li>
        <li className="list-decimal pb-4">
          You haven&apos;t verified your email address when you signed up so you
          do not have full access yet. Fear not, click on the link below to
          validate your account.
        </li>
        <li className="list-decimal pb-4">
          You are a scammer, in which case, please take a look at your life and
          question why you make these decisions? You are better than this.
        </li>
      </ol>
      <div className="flex gap-8 me-auto">
        <Link
          href="/login"
          className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
        >
          <span>Login</span>
        </Link>
        <Link
          href="/reverify"
          className="w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
        >
          <span>Verify Email</span>
        </Link>    
      </div>
    </section>
  );
}
