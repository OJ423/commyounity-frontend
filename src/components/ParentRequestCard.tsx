import { patchParentAccessRequest } from "@/utils/apiCalls";
import { ParentAccessData, ParentApproveReject } from "@/utils/customTypes";
import { formatShortDate } from "@/utils/dataTransformers";
import { useAuth } from "./context/AuthContext";

interface ParentRequestCardProps {
  request: ParentAccessData;
  invalidTokenResponse: () => void;
}

const ParentRequestCard: React.FC<ParentRequestCardProps> = ({ request, invalidTokenResponse }) => {
  const {token, setToken } = useAuth()

  const handleApproval = async () => {
    try {
      const body:ParentApproveReject = {
        parent_access_request_id: request.parent_access_request_id,
        status: "Approved"
      }
      const data = await patchParentAccessRequest(token, request.school_id, body)
      setToken(data.token)
    }
    catch(error:any) {
      console.log(error)
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }

  };

  const handleRejection = async () => {
    try {
      const body:ParentApproveReject = {
        parent_access_request_id: request.parent_access_request_id,
        status: "Rejected"
      }
      const data = await patchParentAccessRequest(token, request.school_id, body)
      setToken(data.token)
    }
    catch(error:any) {
      console.log(error)
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse();
      }
    }
  };

  return (
    <section className="w-full flex flex-col items-start gap-8 p-4 bg-indigo-100 rounded">
      <div className="w-full flex items-start justify-between flex-wrap gap-8 bg-indigo-100 rounded">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase font-bold text-indigo-500">
            Details:
          </p>
          <p className="font-bold">{request.username}</p>
          <p className="text-sm text-gray-500">{request.user_email}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase font-bold text-indigo-500">Status:</p>
          <p className="font-bold">{request.status}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase font-bold text-indigo-500">
            Request Date:
          </p>
          <p className="font-bold">{formatShortDate(request.created_at)}</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          {request.status === "Pending" ? (
            <>
              <button
                className="w-max border-solid border-4 text-xs text-green-500 border-green-500 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-green-500 hover:border-green-500 hover:text-white transition-all duration-500 ease-out"
                onClick={handleApproval}
              >
                Approve
              </button>
              <button
                className="w-max border-solid border-4 text-xs text-red-500 border-red-500 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 ease-out"
                onClick={handleRejection}
              >
                Reject
              </button>
            </>
          ) : request.status === "Approved" ? (
            <button
              className="w-max border-solid border-4 text-xs text-red-500 border-red-500 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 ease-out"
              onClick={handleRejection}
            >
              Reject
            </button>
          ) : (
            <button
              className="w-max border-solid border-4 text-xs text-green-500 border-green-500 py-2 px-3 inline-block rounded-xl uppercase font-semibold hover:bg-green-500 hover:border-green-500 hover:text-white transition-all duration-500 ease-out"
              onClick={handleApproval}
            >
              Approve
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-xs uppercase font-bold text-indigo-500">Message:</p>
        <p>{request.msg}</p>
      </div>
    </section>
  );
};

export default ParentRequestCard;
