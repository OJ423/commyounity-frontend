"use client"

import Link from "next/link";
import { TbPhotoEdit } from "react-icons/tb";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { patchEntity, patchEntityImg, patchUser, uploadFile } from "@/utils/apiCalls";
import { handleUpload } from "@/utils/blobFuncs";
import FormDrawer from "./FormDrawer";

interface EditHeaderImageProps {
  id: string | undefined;
  type: string;
}

const EditHeaderImage:React.FC<EditHeaderImageProps> = ({id, type}) => {
  const { user, token, setUserAdmins, setUserMemberships } = useAuth();
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

  const updateContext = (imgUrl:string) => {
    const savedUserMemberships = localStorage.getItem("userMemberships")
    const savedUserAdmins = localStorage.getItem("userAdmins")
    const urlParam:string = type === "group" ? "groups" : type === "business" ? "businesses" :
    type === "church" ? "churches" : type === "school" ? "schools" : "null"
    
    if (type) {
      if(savedUserMemberships) {
        const parsedMemberships = JSON.parse(savedUserMemberships)
        const updatedEntity = parsedMemberships.userMemberships[urlParam].map((e:any) => {
          if (e[`${type}_id`] === id) {
            type === "group" ? e.group_img = imgUrl : type === "business" ? e.business_img = imgUrl :
            type === "church" ? e.church_img = imgUrl : type === "school" ? e.shool_img = imgUrl : null
          }  
          return e
        })
        parsedMemberships.userMemberships[urlParam] = updatedEntity
        setUserMemberships(parsedMemberships)
        localStorage.setItem("userMemberships", JSON.stringify(parsedMemberships))
        
      if(savedUserAdmins) {
        const parsedAdmins = JSON.parse(savedUserAdmins)
        const updatedAdminsEntities = parsedAdmins[urlParam].map((e:any) => {
          if (e[`${type}_id`] === id) {
            type === "group" ? e.group_img = imgUrl : type === "business" ? e.business_img = imgUrl :
            type === "church" ? e.church_img = imgUrl : type === "school" ? e.shool_img = imgUrl : null
          } 
          return e
        })
        parsedAdmins[urlParam] = updatedAdminsEntities
        setUserAdmins(parsedAdmins)
        localStorage.setItem("userAdmins", JSON.stringify(parsedAdmins))
      }
      }
    }
  }

  const handleUpdateEntityImg = async () => {
    if (user) {
      try {
        const imageUrl:string = await handleUpload(file, token, user?.user_avatar) 
        const updatedData = await patchEntityImg( imageUrl, token, type, id, user?.user_id )
        await updateContext(imageUrl)
        setShowForm(!showForm);
        setFile(null)
      } catch(error:any) {
        console.error('Error:', error);
      }
    }
  }


  return (
    <>
      <Link
        href=""
        onClick={handleDisplayForm}
        className="bottom-2 left-2 absolute text-xs w-max py-2 px-3 inline-block rounded-xl bg-white text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-500 ease-out"
      >
        <TbPhotoEdit size={24}/>
      </Link>
      <FormDrawer setShowForm={setShowForm} showForm={showForm} handleDisplayForm={handleDisplayForm} >
        <h2 className="font-bold text-2xl">Change your {type} header image</h2>
        <p>Choose a file from your device.</p>
        <input type="file" onChange={handleFileChange} className="file:px-4 file:py-2 file:transition-all file:duration-500 file:me-4 file:cursor-pointer" />
        <button className="px-4 py-2 bg-indigo-500 w-fit rounded text-white transition-all duration-500 hover:bg-indigo-200 hover:text-indigo-800" onClick={handleUpdateEntityImg}>Upload</button>
      </FormDrawer>
    </>
  );
}

export default EditHeaderImage