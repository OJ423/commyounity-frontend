import { removeParent } from "@/utils/apiCalls";
import { Parent } from "@/utils/customTypes";

interface ParentCardProps {
  parent: Parent,
  invalidTokenResponse: () => void;
  updateToken: (token:string) => void;
  userToken: string | null;
  schoolId: string;
}


const ParentCard: React.FC<ParentCardProps> = ({parent, invalidTokenResponse, updateToken, userToken, schoolId}) => {
  const handleRemoveParent = async () => {
    try {
      const data = await removeParent(userToken, schoolId, parent.user_id);
      updateToken(data.token)
    }
    catch (error:any) {
      console.log(error);
      if (
        error.response.data.msg === "Authorization header missing" ||
        error.response.data.msg === "Invalid or expired token"
      ) {
        invalidTokenResponse()
      }
    }
  }

  return(
    <section className="w-full py-8 border-b-2 border-indigo-500 flex justify-between items-center gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold">{parent.username}</h2>
        <p className="text-xs text-gray-500">{parent.user_email}</p>
      </div>
      <div>
        <button 
          onClick={handleRemoveParent}
          className="border-solid border-4 border-black py-3 px-6 inline-block rounded-xl uppercase font-semibold hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-500 ease-out text-xs">
          Remove
        </button>
      </div>

    </section>
  )

}

export default ParentCard;