import { Community } from "@/utils/customTypes";
import { SetStateAction, useState } from "react";

interface SearchProps {
  communityList: Community[] | [];
  setCommunitySearch: React.Dispatch<SetStateAction<Community[] | []>>;
}

const CommunitySearch: React.FC<SearchProps> = ({
  communityList,
  setCommunitySearch,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clearSearch, setClearSearch] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    const searchValue = e.currentTarget.value;
    setSearchTerm(searchValue)
    if (searchValue.length === 0) setClearSearch(false);
    if (searchValue.length > 0) setClearSearch(true);
    if (searchValue.length > 2) {
      const filteredCommunities: Community[] | [] = communityList.filter(
        (community) => {
          return community.community_name
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        }
      );
      setCommunitySearch(filteredCommunities);
    } else {
      setCommunitySearch([]);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCommunitySearch([]);
    setClearSearch(false);
  };

  return (
    <form
      className="flex flex-col sm:flex-row items-center gap-4"
    >
      <label className="text-xs font-bold text-gray-600" htmlFor="search">
        Search Communities:
      </label>
      <input
        className="p-2 rounded"
        id="search"
        value={searchTerm}
        onChange={handleSearch}
      />
      {clearSearch && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="text-sm font-bold p-2 rounded-xl border-2 border-indigo-500 text-indigo-500 transition-all duration-500 hover:bg-indigo-500 hover:text-white"
        >
          Clear Search
        </button>
      )}
    </form>
  );
};

export default CommunitySearch;
