"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { GenericFormData } from "@/utils/customTypes";
import { handleUpload } from "@/utils/blobFuncs";
import { addNewEntity, getUserAdmins, getUserMemberships } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NewGroupFormProps {
  type: string;
}

const NewGroupForm: React.FC<NewGroupFormProps> = ({ type }) => {
  const { user, setUser, token, setToken, setCommunities, selectedCommunity, setSelectedCommunity, setUserMemberships,  setUserAdmins, setUserPostLikes } = useAuth();

  const [ newEntityErr, setNewEntityErr ] = useState<string | null>(null)
  const [ formSubmitted, setFormSubmitted ] = useState<boolean>(false)

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenericFormData>();


  async function setMemberships() {
    try {
      if (user) {
        const memberships = await getUserMemberships(
          +user?.user_id,
          selectedCommunity?.community_id,
          token
        );
        setUserMemberships(memberships);
        localStorage.setItem("userMemberships", JSON.stringify(memberships));
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error.response.data.msg);
    }
  }

  async function setAdmins() {
    try {
      if (user) {
        const admins = await getUserAdmins(+user.user_id, selectedCommunity?.community_id, token);
        setUserAdmins(admins);
        localStorage.setItem("userAdmins", JSON.stringify(admins));
      }
    } catch (error: any) {
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
      console.log(error.response.data.msg);
    }
  }

  const invalidTokenResponse = (): void => {
    LogUserOut({
      setToken,
      setUser,
      setCommunities,
      setSelectedCommunity,
      setUserMemberships,
      setUserAdmins,
      setUserPostLikes,
    });
    router.push("/login");
  };

  const submitLogic = async (data: GenericFormData) => {
    try {
      let imageUrl:string;
      if (data.img) {
          imageUrl = await handleUpload(
          data.img[0],
          token,
          "no existing image"
        );
      }
      else { imageUrl = "" }

      if (type === "group" && selectedCommunity && user) {
        const body = {
          group_name: data.title,
          group_bio: data.bio,
          group_img: imageUrl,
          community_id: +selectedCommunity?.community_id,
        }

        const newGroup = await addNewEntity(body, token, type, +user?.user_id);
        await setMemberships()
        await setAdmins()
        return newGroup.newGroup
      }
      if (type === "church" && selectedCommunity && user) {
        const body = {
          church_name: data.title,
          church_bio: data.bio,
          church_img: imageUrl,
          church_email: data.email,
          church_website: data.website,
          community_id: +selectedCommunity?.community_id,
        };
        const newChurch = await addNewEntity(body, token, type, +user?.user_id);
        await setMemberships()
        await setAdmins()
        return newChurch.newChurch
      }
      if (type === "business" && selectedCommunity && user) {
        const body = {
          business_name: data.title,
          business_bio: data.bio,
          business_img: imageUrl,
          business_email: data.email,
          business_website: data.website,
          community_id: +selectedCommunity?.community_id,
        };
        const newBusiness = await addNewEntity(body, token, type, +user?.user_id);
        await setMemberships()
        await setAdmins()
        return newBusiness.newBusiness
      }

      if (type === "school" && selectedCommunity && user) {
        const body = {
          school_name: data.title,
          school_bio: data.bio,
          school_img: imageUrl,
          school_email: data.email,
          school_website: data.website,
          school_phone: data.phone,
          community_id: +selectedCommunity?.community_id,
        };
        const newSchool = await addNewEntity(body, token, type, +user?.user_id);
        await setMemberships()
        await setAdmins()
        return newSchool.newSchool
      }
      
    } catch (error: any) {
      console.log('There was an error', error)
      throw error
    }
  }

  const onSubmit: SubmitHandler<GenericFormData> = async (data) => {
    try {
      const newEntity = await submitLogic(data)
      if(type === "group") router.push(`/groups/${newEntity.group_id}`)
      if(type === "church") router.push(`/churches/${newEntity.church_id}`)
      if(type === "business") router.push(`/businesses/${newEntity.business_id}`)
      if(type === "school") router.push(`/schools/${newEntity.school_id}`)
      setFormSubmitted(true)
    }  
     catch(error:any) {
      console.error("There was an error:", error)
      setNewEntityErr(`There was an error creating the new ${type}` )
    }
  };
  
  return (
    <>
    {formSubmitted ?
     <div className="flex flex-col justified-center gap-8">
      <h2 className="font-bold text-2xl">Thanks for submitting a new {type}</h2>
      <p>You will be directed to your new {type} in a sec.</p>
    </div>
     :
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label
        className="text-xs uppercase text-gray-700 font-bold"
        htmlFor="title"
        >
        {type} name:
      </label>
      <input
        className="p-4 mb-4 rounded border-2 mt-2"
        placeholder={`${type} name`}
        {...register("title", {
          required: `${type} name is required`,
          minLength: 5,
        })}
        id={`title`}
        name={`title`}
        />
      {errors.title && (
        <span className="mb-4 text-rose-600 text-xs font-bold">
          {type} name is require
        </span>
      )}

      <label
        className="text-xs uppercase text-gray-700 font-bold"
        htmlFor="bio"
        >
        {type} bio (Max 250 characters):
      </label>
      <textarea
        className="p-4 mb-4 rounded border-2 mt-2"
        placeholder={`Give your ${type} a bio to explain to users what it's about`}
        {...register("bio", {
          required: "Bio required",
          minLength: 10,
          maxLength: 250
        })}
        id="bio"
        name="bio"
        rows={4}
      />
      {errors.bio && (
        <span className="mb-4 text-rose-600 text-xs font-bold">
          The {type} bio needs to be 10 or more characters
        </span>
      )}

      {type === "business" || type === "school" || type === "church" ? (
        <>
          <label
            className="text-xs uppercase text-gray-700 font-bold"
            htmlFor="website"
            >
            {type} website:
          </label>
          <input
            className="p-4 mb-4 rounded border-2 mt-2"
            placeholder={`Let people know your website`}
            {...register("website")}
            id="website"
            name="website"
            />

          <label
            className="text-xs uppercase text-gray-700 font-bold"
            htmlFor="email"
            >
            {type} email:
          </label>
          <input
            className="p-4 mb-4 rounded border-2 mt-2"
            placeholder={`Your ${type} email`}
            {...register("email", {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            id="email"
            name="email"
            />
          {errors.bio && (
            <span className="mb-4 text-rose-600 text-xs font-bold">
              Please use a valid email address
            </span>
          )}
        </>
      ) : null}

      {type === "school" ? (
        <>
          <label
            className="text-xs uppercase text-gray-700 font-bold"
            htmlFor="phone"
          >
            {type} phone number:
          </label>
          <input
            className="p-4 mb-4 rounded border-2 mt-2"
            placeholder={`Your ${type} phone`}
            {...register("phone")}
            id="phone"
            name="phone"
          />
        </>
      ) : null}

      <label
        className="text-xs uppercase text-gray-700 font-bold"
        htmlFor="img"
        >
        Upload {type} image:
      </label>
      <input
        className="p-4 mb-4 rounded border-2 mt-2 file:px-4 file:py-2 file:transition-all file:duration-500 file:me-4 file:cursor-pointer"
        {...register("img")}
        id="img"
        name="img"
        type="file"
        />

      <input
        className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
        type="submit"
        />
      {newEntityErr ?
      <p className="text-rose-600 font-bold">{newEntityErr}</p>
      : null
      }
    </form>
     
    }
    </>
  );
};

export default NewGroupForm;
