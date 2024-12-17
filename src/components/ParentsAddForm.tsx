"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { addNewParent } from "@/utils/apiCalls";
import { useEffect, useState } from "react";

interface ParentAddFormProps {
  id: string;
  invalidTokenResponse: () => void;
  updateToken: (token: string) => void;
  userToken: string | null;
}

interface AddParent {
  user_email:string;
}

const ParentAddForm: React.FC<ParentAddFormProps> = ({
  id,
  invalidTokenResponse,
  updateToken,
  userToken,
}) => {

  const [apiErr, setApiErr] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<AddParent>();

  const onSubmit: SubmitHandler<AddParent> = async (data) => {
    try {
      setApiErr(null)
      const response = await addNewParent(userToken, id, data);
      if (response.parent.length === 0) {
        setApiErr("The email address you supplied is not in our database")
      }
      updateToken(response.token);
      setFormSubmitted(!formSubmitted);
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error creating the new post`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="user_email"
        >
          Parent Email:
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

export default ParentAddForm;
