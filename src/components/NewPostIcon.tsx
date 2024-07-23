"use client"

import { useAuth } from "./context/AuthContext";
import FormDrawer from "./FormDrawer";
import { useState } from "react";
import { MdPostAdd } from "react-icons/md";
import { GroupData, NewPostData } from "@/utils/customTypes";
import NewPostForm from "./NewPostForm";


interface NewPostProps {
  type: string;
  id: number | undefined;
  fetchPosts: boolean;
  setFetchPosts:React.Dispatch<React.SetStateAction<boolean>>
}

const NewPostIcon: React.FC<NewPostProps> = ({ type, id, fetchPosts, setFetchPosts }) => {
  const { selectedCommunity, user, token } = useAuth();
  const [ showForm, setShowForm ] = useState<boolean>(false);
  const handleDisplayForm = () => { 
    setShowForm(!showForm)
  };

  return (
    <>
      <MdPostAdd onClick={handleDisplayForm} size={32} aria-label="create new post" className="hover:text-indigo-500 duration-500 transition-all cursor-pointer hover:" />
      <FormDrawer setShowForm={setShowForm} showForm={showForm} handleDisplayForm={handleDisplayForm} >
      <h2 className="font-bold text-2xl">Add a new post</h2>
      <p>Fill in the form to create a new post.</p>
        <NewPostForm type={type} id={id} fetchPosts={fetchPosts} setFetchPosts={setFetchPosts} showForm={showForm} setShowForm={setShowForm} />
      </FormDrawer>
    </>
  );
};

export default NewPostIcon;