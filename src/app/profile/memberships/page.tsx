"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import GenericCard from "@/components/GenericCard";
import Header from "@/components/Header";
import ProfilePagesNav from "@/components/ProfilePagesNav";
import { CardData } from "@/utils/customTypes";
import {
  transformChurchData,
  transformGroupData,
  transformSchoolData,
} from "@/utils/dataTransformers";
import { useEffect, useState } from "react";

export default function Memberships() {
  const { user, userMemberships } = useAuth();
  const [groupMemberships, setGroupMemberships] = useState<CardData[] | []>([]);
  const [schoolMemberships, setSchoolMemberships] = useState<CardData[] | []>(
    []
  );
  const [churchMemberships, setChurchMemberships] = useState<CardData[] | []>(
    []
  );
  const owner = false;
  const communityMember = true;

  useEffect(() => {
    if (userMemberships) {
      const transformMembershipData = async () => {
        const transformGroups = await transformGroupData(
          userMemberships.userMemberships.groups
        );
        const transformSchools = await transformSchoolData(
          userMemberships.userMemberships.schools
        );
        const transformChurches = await transformChurchData(
          userMemberships.userMemberships.churches
        );
        setGroupMemberships(transformGroups);
        setSchoolMemberships(transformSchools);
        setChurchMemberships(transformChurches);
      };
      transformMembershipData();
    }
  }, [userMemberships]);

  return (
    <>
      {user ? (
        <main className="flex min-h-screen flex items-center">
          <>
            <ProfilePagesNav />
            <section className="px-4 py-16 md:p-8 lg:p-16 xl:p-24 w-full">
              <div className="pb-8 mb-8 border-b border-gray-300 lg:w-3/4 xl:w-2/3">
                <h1 className="font-bold text-2xl md:text-3xl pb-4">
                  Here are your community memberships,{" "}
                  <span className="text-indigo-500">{user.username}</span>
                </h1>
                <p>
                  Listed below are your community memberships, including groups
                  and churches that you have joined and schools where you are a
                  parent.
                </p>
              </div>
              {groupMemberships.length ? (
                <>
                  <h2 className="text-lg font-semibold mb-8">
                    Your Group Memberships
                  </h2>
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300"
                    }
                  >
                    {groupMemberships.map((group: CardData) => (
                      <GenericCard
                        key={group.id}
                        data={group}
                        urlParams={"/groups/"}
                        owner={owner}
                        communityMember={communityMember}
                      />
                    ))}
                  </div>
                </>
              ) : null}
              {schoolMemberships.length ? (
                <>
                  <h2 className="text-lg font-semibold mb-8">
                    Your School Memberships
                  </h2>
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300"
                    }
                  >
                    {schoolMemberships.map((group: CardData) => (
                      <GenericCard
                        key={group.id}
                        data={group}
                        urlParams={"/schools/"}
                        owner={owner}
                        communityMember={communityMember}
                      />
                    ))}
                  </div>
                </>
              ) : null}
              {churchMemberships.length ? (
                <>
                  <h2 className="text-lg font-semibold mb-8">
                    Your Church Memberships
                  </h2>
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300"
                    }
                  >
                    {churchMemberships.map((group: CardData) => (
                      <GenericCard
                        key={group.id}
                        data={group}
                        urlParams={"/churches/"}
                        owner={owner}
                        communityMember={communityMember}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          </>
        </main>
      ) : (
        <>
          <Header />
          <main className="flex justify-center items-center w-full my-20">
            <p>You need to be signed in to see your memberships</p>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
