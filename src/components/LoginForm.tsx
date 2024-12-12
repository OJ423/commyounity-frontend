"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { LogInInputs } from "@/utils/customTypes";
import {  logUserIn } from "@/utils/apiCalls";
import { usePathname } from "next/navigation";

export default function LoginForm() {
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInInputs>();

  const onSubmit: SubmitHandler<LogInInputs> = async (data) => {
    try {
      setLoggingIn(true)
      await logUserIn(data);
    } catch (error: any) {
      setLoggingIn(false)
      if(error.response.data.msg) {
        setLoginErr("We can't find that email in our database")
      }
      if (error.msg === "Cannot find email address" || error.message === "Request failed with status code 400") {
        setLoginErr("We can't find that email address in our database");
      }
      console.log(error.message);
    }
  };

  return (
    <>
      {!loggingIn ?
      <>
      <h1 className="font-bold text-3xl mb-8">Log in to Comm<span className="text-indigo-500">you</span>nity</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          className="p-4 mb-4 rounded"
          placeholder="Email address"
          {...register("email", {
            required: "Email or Username is required",
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          })}
          id="email"
          name="email"
          autoComplete="email"
          />
        {errors.email && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Correct email format is required
          </span>
        )}
      
        <input
          className="mx-auto w-max cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
          />
      </form>
      {loginErr ? (
        <p className="font-bold mt-8 text-rose-600 text-center">{loginErr}</p>
      ) : null}
      </>
      :
      <>
      <h2 className="font-bold text-2xl mb-4">Please check your email</h2>
      <p className="text-lg">Click on the link in your email to finish logging in. The link expires in 15 minutes.</p>
      </>
    }
      </>
    );
  }
  