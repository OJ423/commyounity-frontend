"use client"

interface FormDrawerProps {
  children: any,
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
  showForm: boolean,
  handleDisplayForm: any
}

const FormDrawer:React.FC<FormDrawerProps> = ({ children, setShowForm, showForm, handleDisplayForm })  => {

  
  return (
    <>
    <section className={`${!showForm ? "translate-x-[100%]" : "translate-x-0"} w-full sm:w-fit sm:max-w-sm transition-all duration-500 h-full top-0 right-0 px-8 fixed ease-in ease-out rounded-xl bg-white shadow-2xl flex flex-col gap-8 justify-center z-20`}>
      {children}
    </section>
    <div onClick={handleDisplayForm} className={`${!showForm ? 'invisible opacity-0': 'opacity-50'} w-full h-[100vh] top-0 left-0 bg-gray-300 fixed duration-500 ease-out transition-all cursor-pointer z-10`}>
      </div>
      <div onClick={handleDisplayForm} className={`${!showForm ? 'invisible opacity-0': 'opacity-100'} fixed cursor-pointer text-gray-600 top-0 w-8 h-8 flex items-center justify-center left-0 mt-5 ml-5 z-50 transition-all duration-1000`}>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
    </>
  )
}

export default FormDrawer