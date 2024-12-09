import FormDrawer from "./FormDrawer";
import { useState } from "react";
import { Comment, PostData, TimelinePosts } from "@/utils/customTypes";
import CommentEditForm from "./CommentEditForm";
import { FiEdit } from "react-icons/fi";

interface EditCommentProps {
  data: Comment;
}

const CommentEditButton: React.FC<EditCommentProps> = ({
  data,
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const handleDisplayForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <button
        onClick={handleDisplayForm}
        className="hover:text-indigo-500 transition-all duration-500 ease-out"
      >
        <FiEdit aria-label="edit post" size={24} title="Edit Post" />
      </button>
      <FormDrawer
        setShowForm={setShowForm}
        showForm={showForm}
        handleDisplayForm={handleDisplayForm}
      >
        <h2 className="font-bold text-2xl">Edit the post</h2>
        <CommentEditForm
          commentData={data}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </FormDrawer>
    </>
  );
};

export default CommentEditButton;