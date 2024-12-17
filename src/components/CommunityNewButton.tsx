import { useState } from "react";
import FormDrawer from "./FormDrawer";
import CommunityNewForm from "./CommunityNewForm";

export default function CommunityNewButton() {
  const [showForm, setShowForm] = useState<boolean>(false)
  const handleDisplayForm = () => {
    setShowForm(!showForm)
  }

  return (
    <>
      <button onClick={handleDisplayForm} className="my-20 bg-indigo-200 shadow-xl p-4 rounded-xl font-bold transition-all duration-500 hover:shadow hover:bg-indigo-400">
        Add a community
      </button>
      <FormDrawer showForm={showForm} setShowForm={setShowForm} handleDisplayForm={handleDisplayForm} >
        <CommunityNewForm handleDisplayForm={handleDisplayForm} /> 
      </FormDrawer>
      
    </>
  );
}
