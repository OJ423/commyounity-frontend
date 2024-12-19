import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import NewPostForm from "./NewPostForm";

interface TimeLinePostChoiceProps {
  fetchPosts: boolean;
  setFetchPosts: React.Dispatch<React.SetStateAction<boolean>>;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimeLinePostChoice: React.FC<TimeLinePostChoiceProps> = ({
  fetchPosts,
  setFetchPosts,
  showForm,
  setShowForm,
}) => {
  const [type, setType] = useState<string>("");
  const [typeSelected, setTypeSelected] = useState<boolean>(false);
  const [selectErr, setSelectErr] = useState<string>("");

  const handleSelectConfirm = () => {
    if (type.length === 0) {
      setSelectErr("Please select where you are posting to.");
      return;
    } else {
      setSelectErr("");
      setTypeSelected(!typeSelected);
    }
  };

  const { userMemberships, userAdmins } = useAuth();

  const groupTypes = userMemberships?.userMemberships.groups.map((group) => {
    return {
      type: "group",
      id: group.group_id,
      entityName: group.group_name,
    };
  });
  const schoolAdmins = userAdmins?.schools.map((school) => {
    return {
      type: "school",
      id: school.school_id,
      entityName: school.school_name,
    };
  });
  const churchAdmins = userAdmins?.churches.map((church) => {
    return {
      type: "church",
      id: church.church_id,
      entityName: church.church_name,
    };
  });
  const businessAdmins = userAdmins?.businesses.map((business) => {
    return {
      type: "business",
      id: business.business_id,
      entityName: business.business_name,
    };
  });

  return (
    <section className="flex flex-col gap-8">
      {!typeSelected ? (
        <>
          <h2 className="font-bold text-xl">
            Please select where you want to post to...
          </h2>
          <form className="flex flex-col gap-4">
            <select onChange={(e) => setType(e.target.value)} className="p-2">
              <option value={""}>Please select...</option>
              {groupTypes?.map((group) => (
                <option
                  className="p-2 border-2 border-indigo-500"
                  value={`${group.id},${group.type}`}
                  key={group.id}
                >
                  {group.entityName}
                </option>
              ))}
              {businessAdmins?.map((business) => (
                <option
                  value={`${business.id},${business.type}`}
                  key={business.id}
                >
                  {business.entityName}
                </option>
              ))}
              {churchAdmins?.map((church) => (
                <option value={`${church.id},${church.type}`} key={church.id}>
                  {church.entityName}
                </option>
              ))}
              {schoolAdmins?.map((school) => (
                <option value={`${school.id},${school.type}`} key={school.id}>
                  {school.entityName}
                </option>
              ))}
            </select>
            <button
              className="border-2 rounded-lg w-max mx-auto px-4 py-2 transition-all duration-500 hover:bg-indigo-500 hover:text-white font-bold"
              type="button"
              onClick={handleSelectConfirm}
            >
              {`Next >>`}
            </button>
          </form>
          {selectErr && <p className="font-bold text-rose-500">{selectErr}</p>}
        </>
      ) : (
        <NewPostForm
          type={type.split(",")[1]}
          id={type.split(",")[0]}
          fetchPosts={fetchPosts}
          setFetchPosts={setFetchPosts}
          showForm={showForm}
          setShowForm={setShowForm}
          setType={setType}
          setTypeSelected={setTypeSelected}
        />
      )}
    </section>
  );
};

export default TimeLinePostChoice;
