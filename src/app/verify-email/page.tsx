"use client";

import { useAuth } from "@/components/context/AuthContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { verifyNewUserAccount } from "@/utils/apiCalls";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const { setUser, setToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [ validated, setValidated ] = useState<boolean>(false);


  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const data = await verifyNewUserAccount(token)
          const userContextData = {
            user_id: data.user.user_id,
            username: data.user.username,
            user_bio: data.user.user_bio,
            user_avatar: data.user.user_avatar,
            date_joined: data.user.date_joined,
            user_email: data.user.user_email,
            status: data.user.status,
          }
          setValidated(true)
          setUser(userContextData)
          setToken(data.token)
          localStorage.setItem('user', JSON.stringify(userContextData))
          localStorage.setItem('token', JSON.stringify(data.token))

          const timeoutId = setTimeout(() => {
            router.push('/communities');
          }, 2000);

        } catch(error:any) {
          console.log(error)
        }
      }
      fetchData()
    }
  }, [token])

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between w-screen">
        <Header />
        <main>
          {token ? (
            <>
              <h1 className="text-3xl mb-8 font-bold">
                Bear with us, while we validate your account.
              </h1>
              <p>
                You will be up and running in a jiffy.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl mb-8 font-bold">
                Please verify your email.
              </h1>
              <p>
                Please check your email and click on the link to verify your
                Comm-YOU-nity account.
              </p>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
