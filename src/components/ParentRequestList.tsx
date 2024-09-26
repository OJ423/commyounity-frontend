import { ParentAccessData } from "@/utils/customTypes";
import ParentRequestStatusFilter from "./ParentRequestStatusFilter";
import ParentRequestCard from "./ParentRequestCard";

interface ParentRequestListProps {
  requests: ParentAccessData[] | null;
  setRequestStatus: React.Dispatch<React.SetStateAction<string>>;
  invalidTokenResponse: () => void;
  handleShowRequests: () => void;
}

const ParentRequestList: React.FC<ParentRequestListProps> = ({
  requests,
  setRequestStatus,
  invalidTokenResponse,
  handleShowRequests,
}) => {
  return (
    <section className="flex flex-col gap-8 my-8">
      <div className="flex items-center justify-between flex-wrap">
        <h2 className="text-2xl font-bold">Parents Requesting School Access</h2>
        <button
          className="w-max border-solid border-4 text-xs border-black py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out"
          onClick={handleShowRequests}
        >
          Posts
        </button>
      </div>
      <p>
        Here are the parents who have requested access to the school to see its
        posts.
      </p>
      <ParentRequestStatusFilter setRequestStatus={setRequestStatus} />
      {requests?.map((request) => (
        <ParentRequestCard
          key={request.parent_access_request_id}
          request={request}
          invalidTokenResponse={invalidTokenResponse}
        />
      ))}
    </section>
  );
};

export default ParentRequestList;
