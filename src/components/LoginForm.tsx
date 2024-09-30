"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { LogInInputs } from "@/utils/customTypes";
import { getUserPostLikes, logUserIn } from "@/utils/apiCalls";

export default function LoginForm() {
  const { setToken, setUser, setCommunities, setUserPostLikes } = useAuth();
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LogInInputs>();

  

  const onSubmit: SubmitHandler<LogInInputs> = async (data) => {
    try {
      setLoggingIn(true)
      const userData = await logUserIn(data);
      const userContextData = {
        user_id: userData.user.user_id,
        username: userData.user.username,
        user_bio: userData.user.user_bio,
        user_avatar: userData.user.user_avatar,
        date_joined: userData.user.date_joined,
        user_email: userData.user.user_email,
        status: userData.user.status,
      }
      setUser(userContextData);
      setToken(userData.token);
      setCommunities(userData.communities);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userContextData));
      localStorage.setItem("communities", JSON.stringify(userData.communities));
      const postLikeData = await getUserPostLikes(userData.token)
      setUserPostLikes(postLikeData.userPostLikes)
      localStorage.setItem("userPostLikes", JSON.stringify(postLikeData.userPostLikes))

      router.push("/communities");
    } catch (error: any) {
      setLoggingIn(false)
      if (error.message === "Request failed with status code 404" || error.message === "Request failed with status code 400") {
        setLoginErr("Email or password do not match");
      }
      console.log(error.message);
    }
  };

  return (
    <>
      {!loggingIn ?
      <>
      <h1 className="font-bold text-3xl mb-8">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input
          className="p-4 mb-4 rounded"
          placeholder="Email Address/Or Username"
          {...register("username", {
            required: "Email or Username is required",
          })}
          id="username"
          name="username"
          autoComplete="username"
          />
        {errors.username && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Correct email format is required
          </span>
        )}
        <label htmlFor="password">Password</label>
        <input
          className="p-4 mb-8 rounded"
          placeholder="Password"
          {...register("password", {
            required: "Password required",
            minLength: 6,
          })}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          />
        {errors.password && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Password needs to be 6 or more characters
          </span>
        )}

        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
          />
      </form>
      {loginErr ? (
        <p className="font-bold mt-8 text-rose-600 text-center">{loginErr}</p>
      ) : null}
      </>
      :
      <p className="font-bold">Logging you in</p>
    }
      </>
    );
  }
  