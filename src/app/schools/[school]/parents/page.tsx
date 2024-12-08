"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ParentAddForm from "@/components/ParentsAddForm";
import ParentCard from "@/components/ParentsCard";
import { getSchoolById, getSchoolParents } from "@/utils/apiCalls";
import { Parent, SchoolData } from "@/utils/customTypes";
import { LogUserOut } from "@/utils/logOut";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SchoolParents() {
  const { school: schoolParam } = useParams<{ school: string }>();
  const router = useRouter();

  const {
    token,
    setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserPostLikes,
    setUserAdmins,
    setUserMemberships,
    setAdminCommunities
  } = useAuth();

  const [adminCheck, setAdminCheck] = useState<boolean>(false);
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [parents, setParents] = useState<Parent[] | null>(null);

  const invalidTokenResponse = (): void => {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
      setAdminCommunities
    });
    router.push("/login");
  };

  const updateToken = (updatedToken: string): void => {
    setToken(updatedToken);
    localStorage.setItem("token", updatedToken);
  };

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!schoolParam) return;

    // Check admin
    const localUserAdmins = localStorage.getItem("userAdmins");
    if (localUserAdmins) {
      const parsedUserAdmins = JSON.parse(localUserAdmins);
      const checkAdmin = parsedUserAdmins.schools.some(
        (s: any) => +s.school_id === +schoolParam
      );
      if (checkAdmin) {
        setAdminCheck(true);
      }
    }

    // Get school data
    const fetchSchoolData = async () => {
      try {
        const data = await getSchoolById(schoolParam, localToken);
        setSchool(data.school);
      } catch (error: any) {
        console.log(error);
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          invalidTokenResponse();
        }
      }
    };
    fetchSchoolData();

    // Get parent data
    const fetchParentData = async () => {
      try {
        const data = await getSchoolParents(localToken, +schoolParam);
        setParents(data.parents);
        updateToken(data.token);
      } catch (error: any) {
        console.log(error);
        if (
          error.response.data.msg === "Authorization header missing" ||
          error.response.data.msg === "Invalid or expired token"
        ) {
          invalidTokenResponse();
        }
      }
    };
    fetchParentData();
  }, [setAdminCheck, schoolParam, token]);

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center my-10 md:my-20 max-w-screen-xl mx-auto px-4">
        <button
          className="transition-all duration-500 font-bold text-indigo-500 hover:text-indigo-300 w-full text-left mb-8"
          onClick={() => router.back()}>
            {`<< Back`}
        </button>
        {adminCheck ? (
          <>
            <h1 className="font-semibold text-2xl md:text-3xl w-full">
              {school?.school_name} Parents
            </h1>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 my-8">
              <div className="lg:col-span-2">
                {parents?.map((parent) => (
                  <ParentCard
                    parent={parent}
                    invalidTokenResponse={invalidTokenResponse}
                    updateToken={updateToken}
                    userToken={token}
                    schoolId={+schoolParam}
                    key={parent.school_parent_junction_id}
                  />
                ))}
              </div>
              <div className="lg:col-span-1 flex flex-col gap-8">
                <h2 className="font-semibold text-lg">Add a parent</h2>
                <p>{`Add the parent's email address. They must already be registered on Commyounity to successfully add them as a parent.`}</p>
                <ParentAddForm id={+schoolParam} invalidTokenResponse={invalidTokenResponse} updateToken={updateToken} userToken={token} />
              </div>
            </section>
          </>
        ) : (
          <p className="my-20">
            You need to be a school administrator to see this page.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
