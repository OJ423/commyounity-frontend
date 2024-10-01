"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import GenericCard from "@/components/GenericCard";
import Header from "@/components/Header";
import ProfilePagesNav from "@/components/ProfilePagesNav";
import { CardData } from "@/utils/customTypes";
import {
  transformBusinessData,
  transformChurchData,
  transformGroupData,
  transformSchoolData,
} from "@/utils/dataTransformers";
import { useEffect, useState } from "react";

export default function Admin() {
  const { user, userAdmins, selectedCommunity } = useAuth();
  const [groupAdmins, setGroupAdmins] = useState<CardData[] | []>([]);
  const [schoolAdmins, setSchoolAdmins] = useState<CardData[] | []>([]);
  const [churchAdmins, setChurchAdmins] = useState<CardData[] | []>([]);
  const [businessAdmins, setBusinessAdmins] = useState<CardData[] | []>([]);

  useEffect(() => {
    if (userAdmins) {
      const transformMembershipData = async () => {
        const transformGroups = await transformGroupData(userAdmins.groups);
        const transformSchools = await transformSchoolData(userAdmins.schools);
        const transformChurches = await transformChurchData(
          userAdmins.churches
        );
        const transformBusinesses = await transformBusinessData(
          userAdmins.businesses
        );
        setGroupAdmins(transformGroups);
        setSchoolAdmins(transformSchools);
        setChurchAdmins(transformChurches);
        setBusinessAdmins(transformBusinesses);
      };
      transformMembershipData();
    }
  }, [userAdmins]);

  return (
    <>
      {user ? (
        <main className="flex min-h-screen flex items-center">
          <>
            <ProfilePagesNav />
            <section className="px-4 py-16 md:p-8 lg:p-16 xl:p-24 w-full">
              <div className="pb-8 mb-8 border-b border-gray-300 lg:w-3/4 xl:w-2/3">
                <h1 className="font-bold text-2xl md:text-3xl pb-4">
                  Here are the groups and things you are an admin of in{" "}
                  <span className="text-indigo-500">
                    {selectedCommunity?.community_name}
                  </span>
                </h1>
                <p>
                  Any groups, schools, churches you set up in Comm-you-nity will
                  be listed here. You need to select the community before
                  accessing this page.
                </p>
              </div>
              {businessAdmins.length ? (
                <>
                  <h2 className="text-lg font-semibold mb-8">
                    Your Businesses
                  </h2>
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300"
                    }
                  >
                    {businessAdmins.map((business: CardData) => (
                      <GenericCard
                        key={business.id}
                        data={business}
                        urlParams={"/businesses/"}
                      />
                    ))}
                  </div>
                </>
              ) : null}
              {groupAdmins.length ? (
                <>
                  <h2 className="text-lg font-semibold mb-8">Groups You Own</h2>
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300"
                    }
                  >
                    {groupAdmins.map((group: CardData) => (
                      <GenericCard
                        key={group.id}
                        data={group}
                        urlParams={"/groups/"}
                      />
                    ))}
                  </div>
                </>
              ) : null}
              {schoolAdmins.length ? (
                <>
                  <h2 className="text-lg font-semibold mb-8">
                    Schools You Administer
                  </h2>
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300"
                    }
                  >
                    {schoolAdmins.map((group: CardData) => (
                      <GenericCard
                        key={group.id}
                        data={group}
                        urlParams={"/schools/"}
                      />
                    ))}
                  </div>
                </>
              ) : null}
              {churchAdmins.length ? (
                <>
                  <h2 className="text-lg font-semibold mb-8">Your Churches</h2>
                  <div
                    className={
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300"
                    }
                  >
                    {churchAdmins.map((group: CardData) => (
                      <GenericCard
                        key={group.id}
                        data={group}
                        urlParams={"/churches/"}
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
            <p>You need to be signed in to see your admin profiles</p>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
