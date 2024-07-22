"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { BusinessData, ChurchData, GenericFormData, GroupData, SchoolData } from "@/utils/customTypes";
import { patchEntity } from "@/utils/apiCalls";
import { LogUserOut } from "@/utils/logOut";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EditGroupFormProps {
  type: string;
  entityID: number | undefined;
  propData: BusinessData | ChurchData | GroupData | SchoolData | undefined;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditGroupForm: React.FC<EditGroupFormProps> = ({
  type,
  entityID,
  propData,
  showForm,
  setShowForm,
}) => {
  const { user, setUser, token, setToken, setCommunities,
    selectedCommunity, setSelectedCommunity, setUserMemberships,
    setUserAdmins, setUserPostLikes } = useAuth();

  const [newEntityErr, setNewEntityErr] = useState<string | null>(null);

  function dataConverter()  {
    if (propData) {
      switch (type) {
        case "business":
          const businessData = propData as BusinessData;
          return {
            title: businessData.business_name,
            bio: businessData.business_bio,
            img: null,
            email: businessData.business_email || null,
            website: businessData.business_website || null,
            phone: null,
          };
        case "church":
          const churchData = propData as ChurchData;
          return {
            title: churchData.church_name,
            bio: churchData.church_bio,
            img: null,
            email: churchData.church_email || null,
            website: churchData.church_website || null,
            phone: null,
          };
        case "group":
          const groupData = propData as GroupData;
          return {
            title: groupData.group_name,
            bio: groupData.group_bio,
            img: null,
            email: null,
            website: null,
            phone: null,
          };
        case "school":
          const schoolData = propData as SchoolData;
          return {
            title: schoolData.school_name,
            bio: schoolData.school_bio,
            img: null,
            email: schoolData.school_email || null,
            website: schoolData.school_website || null,
            phone: schoolData.school_phone || null,
          };
        default:
          return {
            title: "",
            bio: "",
            img: null,
            email: null,
            website: null,
            phone: null,
          };
      }
    }
    return {
      title: "",
      bio: "",
      img: null,
      email: null,
      website: null,
      phone: null,
    };
  };

  const genericData: GenericFormData = dataConverter();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GenericFormData>({
    defaultValues: genericData,
  });

  useEffect(() => {
    if (propData) {
      const newValues = dataConverter();
      setValue("title", newValues.title);
      setValue("bio", newValues.bio);
      setValue("email", newValues.email);
      setValue("website", newValues.website);
      setValue("phone", newValues.phone);
    }
  }, [propData, type, setValue]);

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
      if (type === "group" && selectedCommunity && user) {
        const body = {
          group_name: data.title,
          group_bio: data.bio,
        };

        const group = await patchEntity(
          body,
          token,
          type,
          entityID,
          +user?.user_id
        );
        return group.group;
      }
      if (type === "church" && selectedCommunity && user) {
        const body = {
          church_name: data.title,
          church_bio: data.bio,
          church_email: data.email,
          church_website: data.website,
        };
        const church = await patchEntity(
          body,
          token,
          type,
          entityID,
          +user?.user_id
        );
        return church.church;
      }
      if (type === "business" && selectedCommunity && user) {
        const body = {
          business_name: data.title,
          business_bio: data.bio,
          business_email: data.email,
          business_website: data.website,
        };
        const business = await patchEntity(
          body,
          token,
          type,
          entityID,
          +user?.user_id
        );
        return business.business;
      }

      if (type === "school" && selectedCommunity && user) {
        const body = {
          school_name: data.title,
          school_bio: data.bio,
          school_email: data.email,
          school_website: data.website,
          school_phone: data.phone,
        };
        const school = await patchEntity(
          body,
          token,
          type,
          entityID,
          +user?.user_id
        );
        return school.school;
      }
    } catch (error: any) {
      console.log("There was an error", error);
      throw error;
    }
  };

  const onSubmit: SubmitHandler<GenericFormData> = async (data) => {
    try {
      const editedEntity = await submitLogic(data);
      if (type === "group") router.push(`/groups/${editedEntity.group_id}`);
      if (type === "church") router.push(`/churches/${editedEntity.church_id}`);
      if (type === "business") router.push(`/businesses/${editedEntity.business_id}`);
      if (type === "school") router.push(`/schools/${editedEntity.school_id}`);
      setShowForm(!showForm)
    } catch (error: any) {
      console.error("There was an error:", error);
      setNewEntityErr(`There was an error editing you ${type}.`);
    }
  };

  return (
    <>
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
          {type} bio (Max 1000 characters):
        </label>
        <textarea
          className="p-4 mb-4 rounded border-2 mt-2"
          placeholder={`Give your ${type} a bio to explain to users what it's about`}
          {...register("bio", {
            required: "Bio required",
            minLength: 10,
            maxLength: 1000,
          })}
          id="bio"
          name="bio"
          rows={6}
        />
        {errors.bio && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            The {type} bio needs to be 10 or more characters
          </span>
        )}
        {watch("bio").length > 900 ? (
          <span className="text-sm mb-4 text-rose-500 font-semibold">
            {watch("bio") ? `${watch("bio").length} characters` : null}
          </span>
        ) : null}

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

        <input
          className="cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
        />
        {newEntityErr ? (
          <p className="text-rose-600 font-bold">{newEntityErr}</p>
        ) : null}
      </form>
    </>
  );
};

export default EditGroupForm;
