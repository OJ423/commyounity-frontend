"use client"

import { useAuth } from "./context/AuthContext";
import FormDrawer from "./FormDrawer";
import { useState } from "react";
import NewGroupForm from "./NewGroupForm";
import { MdOutlineAddBox } from "react-icons/md";


interface NewGroupProps {
  type: string;
}

const NewGroupIcon: React.FC<NewGroupProps> = ({ type }) => {
  const { selectedCommunity } = useAuth();
  const [ showForm, setShowForm ] = useState<boolean>(false);
  const handleDisplayForm = () => { 
    setShowForm(!showForm)
  };

  return (
    <>
      <MdOutlineAddBox onClick={handleDisplayForm} size={32} className="hover:text-indigo-500 duration-500 transition-all cursor-pointer hover:" />
      <FormDrawer setShowForm={setShowForm} showForm={showForm} handleDisplayForm={handleDisplayForm} >
      <h2 className="font-bold text-2xl">Add a new {type}</h2>
      <p>Fill in the form to create a new {type}. Provide details to let other comm-YOU-nity members more about the {type}.</p>
        <NewGroupForm type={type} />
      </FormDrawer>
    </>
  );
};

export default NewGroupIcon;