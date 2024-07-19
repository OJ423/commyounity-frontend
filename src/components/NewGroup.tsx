"use client"

import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import FormDrawer from "./FormDrawer";
import { useState } from "react";
import NewGroupForm from "./NewGroupForm";

interface NewGroupProps {
  type: string;
}

const NewGroup: React.FC<NewGroupProps> = ({ type }) => {
  const { selectedCommunity, token, communities } = useAuth();
  const [ showForm, setShowForm ] = useState<boolean>(false);
  const handleDisplayForm = () => { 
    setShowForm(!showForm)
  };

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">Add a new {type}</h2>
        <p>
          Add a new {type} that you think will be of interest to{" "}
          {selectedCommunity?.community_name}. You will be the {type} owner
          meaning you can edit or delete it.
        </p>
        <button onClick={handleDisplayForm} className="border-solid w-fit border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
          <span>New {type}</span>
        </button>
      </section>
      <FormDrawer setShowForm={setShowForm} showForm={showForm} handleDisplayForm={handleDisplayForm} >
      <h2 className="font-bold text-2xl">Add a new {type}</h2>
      <p>Fill in the form to create a new {type}. Provide details to let other comm-YOU-nity members more about the {type}.</p>
        <NewGroupForm type={type} />
      </FormDrawer>
    </>
  );
};

export default NewGroup;
