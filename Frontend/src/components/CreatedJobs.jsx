import React, { useState } from 'react'
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import { useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreatedJobs = () => {

  const [loading, setLoading] = useState(false)
  const [createdJobs, setCreatedJobs] = useState([])
  const user = useSelector(state => state.auth.userData);
  const userID = user?.data?._id
  const navigate = useNavigate()
  
  
  useEffect(() => {
  const getMyJobs = async () => {
    setLoading(true)
     try {
      const response = await axios.get(`https://hirrd-backend.vercel.app/api/v1/job/getMyJobs?userID=${userID}`,{
        withCredentials: true 
    })
 
      if (response) {
         setCreatedJobs(response.data?.data)
      }
     } 
     catch (error) {
       console.log(error, "Erro fetching Jobs");
     }
     finally {
       setLoading(false)
     }
  }
      getMyJobs()
  }, [])


  const handleJobDeleted = (deletedJobId) => {
    setCreatedJobs((prevJobs) => prevJobs.filter(job => job._id !== deletedJobId));
  };


  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  return (
    <div>
      {loading ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8">
          {createdJobs?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onJobDeleted={handleJobDeleted}
                  isMyJob
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-16">
              <div className="text-center text-gray-400 text-2xl mb-4">
                No Jobs Found 😢
              </div>
              <button
                onClick={() => navigate('/post-job')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Post a Job
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
