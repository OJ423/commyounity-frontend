"use client"

import { TbPhotoEdit } from "react-icons/tb";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { patchUser } from "@/utils/apiCalls";
import { handleUpload } from "@/utils/blobFuncs";
import FormDrawer from "./FormDrawer";

export default function UploadAvatar() {
  const { user, token, setUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [ showForm, setShowForm ] = useState<boolean>(false);

  const handleDisplayForm = () => { 
    setShowForm(!showForm)
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpdateUserData = async () => {
    try {
      const imageUrl = await handleUpload(file, token, user?.user_avatar) 
      const body = {user_avatar: imageUrl}
      const userData = await patchUser( body, user?.user_id, token )
      const userContextData = {
        user_id: userData.user.user_id,
        username: userData.user.username,
        user_bio: userData.user.user_bio,
        user_avatar: userData.user.user_avatar,
        date_joined: userData.user.date_joined,
        user_email: userData.user.user_email,
        status: userData.user.status,
      }
      setUser(userContextData);
      localStorage.setItem("user", JSON.stringify(userContextData));
      setShowForm(!showForm);
      setFile(null)
    } catch(error:any) {
      console.error('Error:', error);
    }
  }


  return (
    <>
      <button
        onClick={handleDisplayForm}
        className="bottom-2 left-2 absolute text-xs w-max py-2 px-3 inline-block rounded-xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-500 ease-out"
      >
        <TbPhotoEdit size={24}/>
      </button>
      <FormDrawer setShowForm={setShowForm} showForm={showForm} handleDisplayForm={handleDisplayForm} >
        <h2 className="font-bold text-2xl">Upload an Avatar</h2>
        <p>Choose a file from your device.</p>
        <input type="file" onChange={handleFileChange} className="file:px-4 file:py-2 file:transition-all file:duration-500 file:me-4 file:cursor-pointer" />
        <button className="px-4 py-2 bg-indigo-500 w-fit rounded text-white transition-all duration-500 hover:bg-indigo-200 hover:text-indigo-800" onClick={handleUpdateUserData}>Upload</button>
      </FormDrawer>
    </>
  );
}
