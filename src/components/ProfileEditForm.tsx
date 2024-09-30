"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { ProfileEdit } from "@/utils/customTypes";
import { patchUser } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileEditFormProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  showForm,
  setShowForm,
}) => {
  const {
    user,
    setUser,
    token,
    setToken,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
  } = useAuth();

  const router = useRouter();

  const [apiErr, setApiErr] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileEdit>({
    defaultValues: {
      username: user?.username,
      user_bio: user?.user_bio,
      user_email: user?.user_email
    }
  });

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("user_bio", user.user_bio);
      setValue("user_email", user.user_email);
    }
  }, [user, setValue]);

  const invalidTokenResponse = (): void => {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
    });
    router.push("/login");
  };

  const onSubmit: SubmitHandler<ProfileEdit> = async (data) => {
    try {
      const response = await patchUser(data, user?.user_id, token);
      const userContextData = {
        user_id: response.user.user_id,
        username: response.user.username,
        user_bio: response.user.user_bio,
        user_avatar: response.user.user_avatar,
        date_joined: response.user.date_joined,
        user_email: response.user.user_email,
        status: response.user.status,
      }
      setUser(userContextData);
      localStorage.setItem("user", JSON.stringify(userContextData));
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setShowForm(!showForm);
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error updating your profile, please try again.`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="username"
        >
          Username:
        </label>
        <input
          className="p-4 mb-4 rounded border-2 mt-2"
          {...register("username", {
            required: `username is required`,
          })}
          id={`username`}
          name={`username`}
        />
        {errors.username && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Username is require
          </span>
        )}

        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="user_bio"
        >
          Bio (Max 250 characters):
        </label>
        <textarea
          className="p-4 mb-4 rounded border-2 mt-2"
          {...register("user_bio", {
            maxLength: 250,
          })}
          id="user_bio"
          name="user_bio"
          rows={6}
        />
        {errors.user_bio && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Your bio needs to be less than 250 characters
          </span>
        )}
        {watch("user_bio").length > 200 ? (
          <span className="text-sm mb-4 text-rose-500 font-semibold">
            {watch("user_bio")
              ? `${watch("user_bio").length} characters`
              : null}
          </span>
        ) : null}

        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="user_email"
        >
          Email:
        </label>
        <input
          className="p-4 mb-4 rounded border-2 mt-2"
          {...register("user_email", {
            required: "Email address required",
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          })}
          id="user_email"
          name="user_email"
        />
        {errors.user_email && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Require a valid email address
          </span>
        )}

        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
        />
        {apiErr ? <p className="text-rose-600 font-bold">{apiErr}</p> : null}
      </form>
    </>
  );
};

export default ProfileEditForm;
