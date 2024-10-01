"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { addNewAdmin, addNewParent } from "@/utils/apiCalls";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { LogUserOut } from "@/utils/logOut";

interface AdminUserNewProps {
  type: string;
  entityId: number | undefined;
}

interface AddAdmin {
  user_email: string;
}

const AdminUserNew: React.FC<AdminUserNewProps> = ({ type, entityId }) => {
  const [apiErr, setApiErr] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  
  const {
    token,
    setToken,
    setUserAdmins,
    setCommunities,
    setSelectedCommunity,
    setUser,
    setUserMemberships,
    setUserPostLikes,
  } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<AddAdmin>();

  const onSubmit: SubmitHandler<AddAdmin> = async (data) => {
    try {
      setApiErr(null);
      const response = await addNewAdmin(
        token,
        entityId,
        type,
        data.user_email
      );
      if (response.admin.length === 0) {
        setApiErr("The email address you supplied is not in our database");
      }
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setFormSubmitted(!formSubmitted);
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error creating the new post`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        LogUserOut({
          setToken,
          setUserAdmins,
          setCommunities,
          setSelectedCommunity,
          setUser,
          setUserMemberships,
          setUserPostLikes,
        });
      }
    }
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        user_email: "",
      });
    }
  }, [formState, reset]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-8 my-8">
        <div className="flex flex-col">
          <label
            className="text-xs uppercase text-gray-700 font-bold"
            htmlFor="user_email"
          >
            User Email Address:
          </label>
          <input
            className="p-4 mb-4 rounded border-2 mt-2"
            placeholder={`email address`}
            {...register("user_email", {
              required: `Requires a valid email address`,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            id={`user_email`}
            name={`user_email`}
          />
          {errors.user_email && (
            <span className="mb-4 text-rose-600 text-xs font-bold">
              Email address is required
            </span>
          )}
        </div>
        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
        />
        {apiErr ? (
          <p className="text-rose-600 font-bold mt-8">{apiErr}</p>
        ) : null}
      </form>
    </>
  );
};

export default AdminUserNew;
