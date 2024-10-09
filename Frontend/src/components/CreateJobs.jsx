import React, { useState } from 'react'
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import { useEffect } from "react";
import axios from 'axios';


const CreateJobs = () => {

  const [loading, setLoading] = useState(false)
  const [createdJobs, setCreatedJobs] = useState([])

  const getJobs = async () => {
    setLoading(true)
     try {
      const fetchedJobs = await axios.get('api/v1/job/getJobs')
 
      console.log(fetchedJobs);
      if (fetchedJobs) {
         setCreatedJobs(fetchedJobs.data)
      }
     } 
     catch (error) {
       console.log(error, "Erro fetching Jobs");
     }
     finally {
       setLoading(false)
     }
  }

    useEffect(() => {
      getJobs()
    }, [])


  // const { user } = useUser();

  // const {
  //   loading: loadingCreatedJobs,
  //   data: createdJobs,
  //   fn: fnCreatedJobs,
  // } = UseFetch(getMyJobs, {
  //   recruiter_id: user.id,
  // });

  // useEffect(() => {
  //   fnCreatedJobs();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


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
                  // onJobAction={fnCreatedJobs}
                  // isMyJob
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

export default CreateJobs;
