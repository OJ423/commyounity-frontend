import { postNewComment } from "@/utils/apiCalls";
import { SetStateAction, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { CommentInputs } from "@/utils/customTypes";

interface CommentNewFormProps {
  post_id: number;
  comment_ref: number | null;
  setDisplayAddComment: React.Dispatch<SetStateAction<boolean>>;
  displayAddComment: boolean;
  setViewComments: React.Dispatch<SetStateAction<boolean>>;
  invalidTokenResponse: () => void;
}

const CommentNewForm: React.FC<CommentNewFormProps> = ({
  post_id,
  comment_ref,
  setDisplayAddComment,
  displayAddComment,
  setViewComments,
  invalidTokenResponse,
}) => {
  const [apiErr, setApiErr] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const { token, setToken } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CommentInputs>();

  const onSubmit: SubmitHandler<CommentInputs> = async (data) => {
    try {
      setApiErr(null);
      const body = {
        comment_title: data.comment_title,
        comment_body: data.comment_body,
        comment_ref: comment_ref
      }
      const response = await postNewComment(token, post_id, body);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setFormSubmitted(!formSubmitted);
      setViewComments(true);
      setDisplayAddComment(!displayAddComment)
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error adding your comment, please try again.`);
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
        comment_title: "",
        comment_body: "",
      });
    }
  }, [formState, reset, comment_ref]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
        <div className="flex items-center gap-4">
          <label
            className="text-xs uppercase text-gray-700 font-bold col-span-2"
            htmlFor="comment_title"
          >
            Comment Title:
          </label>
          <input
            className="p-4 mb-4 rounded border-2 mt-2 w-full"
            placeholder={`Comment title`}
            {...register("comment_title", {
              required: `Requires a title`,
            })}
            id={`comment_title`}
            name={`comment_title`}
          />
        </div>
        {errors.comment_title && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            A comment requires a title
          </span>
        )}

        <div className="flex items-center w-full gap-4">
          <label
            className="text-xs uppercase text-gray-700 font-bold col-span-2"
            htmlFor="comment_body"
          >
            Comment Body:
          </label>
          <textarea
            className="p-4 mb-4 rounded border-2 mt-2 w-full"
            placeholder={`comment body`}
            {...register("comment_body", {
              required: `Requires a body`,
            })}
            id={`comment_body`}
            name={`comment_body`}
          />
        </div>
        {errors.comment_body && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            A comment requires a body
          </span>
        )}

        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300 w-max ms-auto"
          type="submit"
        />
        {apiErr ? (
          <p className="text-rose-600 font-bold mt-8">{apiErr}</p>
        ) : null}
      </form>
    </>
  );
};

export default CommentNewForm;
