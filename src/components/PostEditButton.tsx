import FormDrawer from "./FormDrawer";
import { useState } from "react";
import { PostData, TimelinePosts } from "@/utils/customTypes";
import EditPostForm from "./PostEditForm";
import { FiEdit } from "react-icons/fi";

interface EditPostProps {
  data: PostData | TimelinePosts;
  postAuthor: boolean;
  owner: boolean;
}

const PostEditButton: React.FC<EditPostProps> = ({
  data,
  postAuthor,
  owner,
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
        <EditPostForm
          owner={owner}
          postAuthor={postAuthor}
          postData={data}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </FormDrawer>
    </>
  );
};

export default PostEditButton;
