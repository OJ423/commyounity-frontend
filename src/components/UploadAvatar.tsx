"use client"

import Link from "next/link";
import { TbPhotoEdit } from "react-icons/tb";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { patchUser, uploadFile } from "@/utils/apiCalls";
import { handleUpload } from "@/utils/blobFuncs";

export default function UploadAvatar() {
  const { user, token, setUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [ showUploadForm, setShowUploadForm ] = useState<boolean>(false);

  const handleDisplayUploadForm = () => { 
    setShowUploadForm(!showUploadForm)
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  
  // const handleUpload = async () => {
  //   if (!file) return;
    
  //   const formData = new FormData();
  //   formData.append('image', file);
    
  //   try {
  //     const response = await uploadFile(file, token)
  //     return response.imgUrl;;
  //   } catch (error:any) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

  const handleUpdateUserData = async () => {
    try {
      const imageUrl = await handleUpload(file, token) 
      const body = {user_avatar: imageUrl}
      const userData = await patchUser( body, user?.user_id, token )
      const userContextData = {
        user_id: userData.user.user_id,
        username: userData.user.username,
        user_bio: userData.user.user_bio,
        user_avatar: userData.user.user_avatar,
        date_joined: userData.user.date_joined,
        email: userData.user.user_email,
        status: userData.user.status,
      }
      setUser(userContextData);
      localStorage.setItem("user", JSON.stringify(userContextData));
      setShowUploadForm(!showUploadForm);
      setFile(null)
    } catch(error:any) {
      console.error('Error:', error);
    }
  }


  return (
    <>
      <Link
        href=""
        onClick={handleDisplayUploadForm}
        className="bottom-2 left-2 absolute text-xs w-max py-2 px-3 inline-block rounded-xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-500 ease-out"
      >
        <TbPhotoEdit size={24}/>
      </Link>
      <section className={`${!showUploadForm ? "translate-x-[100%]" : "translate-x-0"} w-fit transition-all duration-500 h-full top-0 right-0 px-8 fixed ease-in ease-out rounded-xl bg-white shadow-2xl flex flex-col gap-8 justify-center z-20`}>
        <h2 className="font-bold text-2xl">Upload an Avatar</h2>
        <p>Choose a file from your device.</p>
        <input type="file" onChange={handleFileChange} className="file:px-4 file:py-2 file:transition-all file:duration-500 file:me-4 file:cursor-pointer" />
        <button className="px-4 py-2 bg-indigo-500 w-fit rounded text-white transition-all duration-500 hover:bg-indigo-200 hover:text-indigo-800" onClick={handleUpdateUserData}>Upload</button>
      </section>
      <div onClick={handleDisplayUploadForm} className={`${!showUploadForm ? 'invisible opacity-0': 'opacity-50'} w-full h-[100vh] top-0 left-0 bg-gray-300 fixed duration-500 ease-out transition-all cursor-pointer z-10`}>
      </div>
      <div onClick={handleDisplayUploadForm} className={`${!showUploadForm ? 'invisible opacity-0': 'opacity-100'} fixed cursor-pointer text-gray-600 top-0 w-8 h-8 flex items-center justify-center left-0 mt-5 ml-5 z-50 transition-all duration-1000`}>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
    </>
  );
}
