import Link from "next/link";
import { useAuth } from "./context/AuthContext";

interface NewGroupProps {
  type: string;
}

const NewGroup: React.FC<NewGroupProps> = ({ type }) => {
  const { selectedCommunity, token, communities } = useAuth();

  return (
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">Add a new group</h2>
        <p>
          Add a new group that you think will be of interest to{" "}
          {selectedCommunity?.community_name}. You will be the group owner
          meaning you can edit or delete it.
        </p>
        <Link href="" className="border-solid w-fit border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out">
          <span>New Group</span>
        </Link>
      </section>
  );
};

export default NewGroup;
