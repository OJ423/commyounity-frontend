"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PersonalNav from "@/components/PersonalNav";
import PostCard from "@/components/PostCard";
import TimeLinePostButton from "@/components/TimeLinePostButton";
import { getUsersCommunityPosts } from "@/utils/apiCalls";
import { TimelinePosts } from "@/utils/customTypes";
import { LogUserOut } from "@/utils/logOut";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Timeline() {
  const {
    token,
    user,
    selectedCommunity,
    userAdmins,
    setCommunities,
    setSelectedCommunity,
    setToken,
    setUser,
    setUserAdmins,
    setUserMemberships,
    setUserPostLikes,
    setAdminCommunities,
  } = useAuth();

  const [userPosts, setUserPosts] = useState<TimelinePosts[] | []>([]);
  const [postLimit, setPostLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string | null>(null);
  const [member, setMember] = useState<boolean>(true);
  const [apiErr, setApiErr] = useState<string | null>(null);

  const router = useRouter();

  function handleFilterGroups() {
    setFilter("groups");
  }

  function handleFilterSchools() {
    setFilter("schools");
  }

  function handleFilterChurches() {
    setFilter("churches");
  }

  function handleClearFilter() {
    setFilter(null);
  }

  function handleLoadMorePosts() {
    setPostLimit((currentLimit) => currentLimit + 10);
  }

  const checkAdmin = (post: TimelinePosts) => {
    if (!userAdmins) return false;
    const schoolAdmin = userAdmins?.schools.some(
      (school) => school.school_id === post.school_id
    );
    const churchAdmin = userAdmins?.churches.some(
      (church) => church.church_id === post.church_id
    );
    const groupAdmin = userAdmins?.groups.some(
      (group) => group.group_id === post.group_id
    );
    const businessAdmin = userAdmins?.businesses.some(
      (business) => business.business_id === post.business_id
    );
    if (schoolAdmin || churchAdmin || groupAdmin || businessAdmin) return true;
    else {
      return false;
    }
  };

  useEffect(() => {
    if (user && selectedCommunity) {
      const fetchData = async () => {
        try {
          const data = await getUsersCommunityPosts(
            token,
            selectedCommunity.community_id,
            postLimit,
            filter
          );
          setUserPosts(data.posts);
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } catch (error: any) {
          console.error("There was an error:", error);
          setApiErr(`There was an error fetching your timeline.`);
          if (
            error.response.data.msg === "Authorization header missing" ||
            error.response.data.msg === "Invalid or expired token"
          ) {
            LogUserOut({
              setCommunities,
              setSelectedCommunity,
              setToken,
              setUser,
              setUserAdmins,
              setUserMemberships,
              setUserPostLikes,
              setAdminCommunities,
            });
            router.push("/login");
          }
        }
      };
      fetchData();
    }
  }, [user, selectedCommunity, postLimit, filter, token]);

  return (
    <>
      <Header />
      <main className="flex flex-col items-center px-4">
        {selectedCommunity ? (
          <>
            {apiErr ? (
              <p className="text-red-500 font-bold">{apiErr}</p>
            ) : (
              <>
                <section className="w-full sm:w-4/5 lg:w-3/5 xl:w-2/5 mb-8 pb-8 mt-10 border-b border-gray-300 max-w-screen-xl">
                  <div className="flex items-center justify-between mb-8">
                  <h1 className="font-semibold text-3xl">
                    Timeline
                  </h1>
                  <TimeLinePostButton />
                  </div>
                  <div className="w-full flex flex-col sm:flex-row gap-4 justify-start sm:items-center p-4 bg-gray-300 shadow-xl rounded">
                    <p className="font-semibold text-xs">Filter by...</p>
                    <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
                      <button
                        onClick={handleFilterGroups}
                        className={`${
                          filter === "groups"
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : null
                        } text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
                      >
                        <span>Groups</span>
                      </button>
                      <button
                        onClick={handleFilterSchools}
                        className={`${
                          filter === "schools"
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : null
                        } text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
                      >
                        <span>Schools</span>
                      </button>
                      <button
                        onClick={handleFilterChurches}
                        className={`${
                          filter === "churches"
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : null
                        } text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
                      >
                        <span>Churches</span>
                      </button>
                      {filter ? (
                        <button
                          onClick={handleClearFilter}
                          className={`text-xs w-max border-solid border-4 border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out`}
                        >
                          <span>All</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </section>
                <section className="w-full sm:w-4/5 lg:w-3/5 xl:w-2/5 mb-20">
                  <div className="flex flex-col gap-4 md:col-span-5">
                    <>
                      {userPosts.length > 0 ? (
                        <>
                          <div className={"grid grid-cols-1 gap-8"}>
                            {userPosts.map((post: TimelinePosts) => {
                              const ownerCheck = checkAdmin(post);
                              return (
                                <PostCard
                                  key={post.post_id}
                                  data={post}
                                  member={member}
                                  owner={ownerCheck}
                                />
                              );
                            })}
                          </div>
                          {postLimit > userPosts.length ? null : (
                            <button
                              onClick={handleLoadMorePosts}
                              className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl mt-8 uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out w-max mx-auto"
                            >
                              Load More
                            </button>
                          )}
                        </>
                      ) : (
                        <p>{`There are no posts :(`}</p>
                      )}
                    </>
                  </div>
                </section>
              </>
            )}
          </>
        ) : (
          <section className="w-full sm:w-4/5 lg:w-3/5 xl:w-2/5 my-20">
            <h2 className="font-semibold text-2xl mb-8">
              Please select a community
            </h2>
            <p className="mb-8">
              Posts are associated to a community. Select a community to see the
              posts of your memberships.
            </p>
            <Link
              href="/communities"
              className="text-xs w-max border-solid border-4 border-black py-4 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
            >
              <span>Choose a community</span>
            </Link>
          </section>
        )}
        <PersonalNav />
      </main>
      <Footer />
    </>
  );
}
