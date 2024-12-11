"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { confirmLogin, getUserPostLikes, verifyNewUserAccount } from "@/utils/apiCalls";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginConfirm() {
  const {
    setUser,
    setToken,
    setCommunities,
    setAdminCommunities,
    setUserPostLikes,
  } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [apiErr, setApiErr] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const userData = await confirmLogin(token);
          setUser(userData.user);
          setToken(userData.token);
          setCommunities(userData.communities);
          setAdminCommunities(userData.adminCommunities);
          localStorage.setItem("token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData.user));
          localStorage.setItem(
            "communities",
            JSON.stringify(userData.communities)
          );
          localStorage.setItem(
            "adminCommunities",
            JSON.stringify(userData.adminCommunities)
          );
          const postLikeData = await getUserPostLikes(userData.token);
          setUserPostLikes(postLikeData.userPostLikes);
          localStorage.setItem(
            "userPostLikes",
            JSON.stringify(postLikeData.userPostLikes)
          );

          if (userData.communities.length > 0 ) {
            router.push("/profile/communities");
          }
          else {
            router.push("/communities")
          }
        } catch (error: any) {
          setApiErr("Something has gone wrong. Please try and log in again");
          console.log(error);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between w-screen">
        <Header />
        <main className="max-w-md flex flex-col gap-4">
          <h1 className="text-3xl mb-8 font-bold">
            Bear with us, while we log you in.
          </h1>
          <p>You will be up and running in a jiffy.</p>
          {apiErr ? 
          <p className="text-rose-500 font-bold">{apiErr}</p>
          : null}
        </main>
        <Footer />
      </div>
    </>
  );
}
