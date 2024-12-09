import { editComment, postNewComment } from "@/utils/apiCalls";
import { SetStateAction, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { Comment, CommentInputs } from "@/utils/customTypes";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";

interface CommentEditFormProps {
  commentData: Comment;
  showForm: boolean;
  setShowForm: React.Dispatch<SetStateAction<boolean>>;
}

interface CommentEditInputs {
  comment_title: string;
  comment_body: string;
}

const CommentEditForm: React.FC<CommentEditFormProps> = ({
  commentData, showForm, setShowForm
}) => {
  const [apiErr, setApiErr] = useState<string | null>(null);
  const {
    user,
    token,
    setToken,
    setUser,
    setCommunities,
    setSelectedCommunity,
    setUserMemberships,
    setUserAdmins,
    setUserPostLikes,
    setAdminCommunities,
  } = useAuth();

  const router = useRouter();


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CommentEditInputs>({
      defaultValues: {
        comment_title: commentData.comment_title,
        comment_body: commentData.comment_body
      }});

  const onSubmit: SubmitHandler<CommentInputs> = async (data) => {
    try {
      setApiErr(null);
      const response = await editComment(token, commentData.comment_id, data);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      setShowForm(!showForm)
    } catch (error: any) {
      console.error("There was an error:", error);
      setApiErr(`There was an error editing your comment, please try again.`);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  };

  const invalidTokenResponse = (): void => {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
      setAdminCommunities,
    });
    router.push("/login");
  };

  useEffect(() => {
    if (commentData) {
      setValue("comment_title", commentData.comment_title)
      setValue("comment_body", commentData.comment_body)
    }
  }, [commentData, setValue]);

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

export default CommentEditForm;
