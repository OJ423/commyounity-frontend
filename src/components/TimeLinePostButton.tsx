import { useState } from "react";
import FormDrawer from "./FormDrawer";
import CommunityNewForm from "./CommunityNewForm";
import TimeLinePostChoice from "./TimeLinePostChoice";

export default function TimeLinePostButton() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [fetchPosts, setFetchPosts] = useState<boolean>(false);
  const handleDisplayForm = () => {
    setShowForm(!showForm)
  }

  return (
    <>
      <button onClick={handleDisplayForm} className="bg-indigo-200 shadow-xl p-4 rounded-xl font-bold transition-all duration-500 hover:shadow hover:bg-indigo-400">
        New Post
      </button>
      <FormDrawer showForm={showForm} setShowForm={setShowForm} handleDisplayForm={handleDisplayForm} >
        <TimeLinePostChoice showForm={showForm} setShowForm={setShowForm} fetchPosts={fetchPosts} setFetchPosts={setFetchPosts} /> 
      </FormDrawer>
      
    </>
  );
}