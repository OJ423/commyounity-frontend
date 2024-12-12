import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { BlockUser } from "@/utils/customTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import { blockUser } from "@/utils/apiCalls";

interface CommunityBlockUserProps {
  community_id: string;
  username: string;
  handleDisplayForm: () => void;
  invalidTokenResponse: () => void;
}

const CommunityBlockUser: React.FC<CommunityBlockUserProps> = ({
  community_id,
  username,
  handleDisplayForm,
  invalidTokenResponse
}) => {

  const {
    token,
    setToken,
  } = useAuth();


  const [apiErr, setApiErr] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BlockUser>({
    defaultValues: {
      username: username,
    }
  });

  useEffect(() => {
    if (username) {
      setValue("username", username);
      setValue("reason", "");
    }
  }, [username, setValue]);


  const onSubmit: SubmitHandler<BlockUser> = async (data) => {
    try {
      const response = await blockUser(community_id, token, data);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      handleDisplayForm();
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

  return(
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          value={username}
          hidden
          className="p-4 mb-4 rounded border-2 mt-2"
          {...register("username")}
          id={`username`}
          name={`username`}
        />

        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="reason"
        >
          Reason to block user:
        </label>
        <textarea
          className="p-4 mb-4 rounded border-2 mt-2"
          {...register("reason")}
          id="reason"
          name="reason"
          rows={4}
        />

        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
        />
        {apiErr ? <p className="text-rose-600 font-bold">{apiErr}</p> : null}
      </form>
    </>
  )
};

export default CommunityBlockUser
