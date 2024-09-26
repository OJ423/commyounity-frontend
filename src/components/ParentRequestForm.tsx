"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { postParentAccessRequest } from "@/utils/apiCalls";
import { SetStateAction, useEffect, useState } from "react";
import { ParentAccessRequest } from "@/utils/customTypes";
import { useAuth } from "./context/AuthContext";

interface ParentRequestFormProps {
  handleDisplayForm: () => void;
  invalidTokenResponse: () => void;
  school_id: string;
  setRequestSubmitted: React.Dispatch<SetStateAction<boolean>>;
  requestSubmitted:boolean;
}

const ParentRequestForm:React.FC<ParentRequestFormProps> = ({handleDisplayForm, invalidTokenResponse, school_id, requestSubmitted, setRequestSubmitted}) => {

  const [apiErr, setApiErr] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const {token, setToken} = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ParentAccessRequest>();

  const onSubmit: SubmitHandler<ParentAccessRequest> = async (data) => {
    try {
      setApiErr(null)
      const response = await postParentAccessRequest(token, data);
      setToken(response.token);
      setFormSubmitted(!formSubmitted);
      setRequestSubmitted(!requestSubmitted);
      handleDisplayForm();
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error requesting access to the school. Please try again`);
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
        school_id, 
        msg: "",
      });
    }
  }, [formState, reset, school_id]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label
          className="text-xs uppercase text-gray-700 font-bold"
          htmlFor="msg"
        >
          Message:
        </label>
        <p className="text-xs text-gray-500">Please provide some details so the school can identify you.</p>
        <textarea
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder={`Enter your message`}
          {...register("msg")}
          id={`msg`}
          name={`msg`}
        />
        <input 
          hidden
          value={school_id}
          {...register("school_id")}
          id={`school_id`}
          name={`school_id`}
        />
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

export default ParentRequestForm

