import React, { useState } from 'react'
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import { useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';


const CreatedJobs = () => {

  const [loading, setLoading] = useState(false)
  const [createdJobs, setCreatedJobs] = useState([])
  const user = useSelector(state => state.auth.userData);
  const userID = user?.data?._id
  
  
  useEffect(() => {
  const getMyJobs = async () => {
    setLoading(true)
     try {
      const response = await axios.get(`/api/v1/job/getMyJobs?userID=${userID}`)
 
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
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job._id}
                  job={job}
                  onJobDeleted={handleJobDeleted}
                  isMyJob
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
