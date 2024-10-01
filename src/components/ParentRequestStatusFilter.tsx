interface StatusFilterProps {
  setRequestStatus: React.Dispatch<React.SetStateAction<string>>
}

const ParentRequestStatusFilter: React.FC<StatusFilterProps> = ({setRequestStatus}) => {
  
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) :void => {
    setRequestStatus(event.target.value);
  }
  
  return (
    <section className="w-full py-4 flex items-center gap-8 border-b-2 border-indigo-200">
      <h3 className="uppercase text-sm font-bold text-gray-500">
        Filter by request status:
      </h3>
      <form>
        <select className="py-2 px-4" onChange={handleStatusChange}>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </form>
    </section>
  )
}

export default ParentRequestStatusFilter