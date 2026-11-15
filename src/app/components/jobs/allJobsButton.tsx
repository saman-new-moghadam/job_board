'use client'; 


import { useRouter } from "next/navigation";

const AllJobs = () => {
    const router = useRouter(); 

  return (
    <div className="text-center">
      <button
       onClick={()=> {
        router.push('jobs?page=1')
       }}
       className="bg-gray-100 p-2 rounded-md cursor-pointer">
        all jobs
      </button>
    </div>
  );
};

export default AllJobs;
