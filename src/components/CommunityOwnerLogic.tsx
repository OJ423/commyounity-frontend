import { Community } from "@/utils/customTypes";

interface CommunityOwnerLogicProps {
  community: Community;
  owner: boolean;
  handleDisplayForm: (value: string) => void;
  handleShowUserManagement: () => void;
}

const CommunityOwnerLogic: React.FC<CommunityOwnerLogicProps> = ({
  community,
  owner,
  handleDisplayForm,
  handleShowUserManagement,
}) => {
  return (
    <>
      {owner ? (
        <>
          <h3 className="uppercase text-xs text-gray-500">
            Community Administration
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => handleDisplayForm("edit")}
              className="text-xs w-max border-solid border-4 border-black py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
            >
              <span>Edit</span>
            </button>
            <button className="text-xs text-red-500 w-max border-solid border-4 border-red-500 py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 ease-out">
              <span>Delete</span>
            </button>
            <div className="flex items-center gap-4 flex-wrap">
              <h4 className="uppercase text-xs text-gray-500">Users:</h4>
              <button
                onClick={handleShowUserManagement}
                className="text-xs w-max border-solid border-4 border-black py-2 px-4 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
              >
                <span>Members & Admins</span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CommunityOwnerLogic;
