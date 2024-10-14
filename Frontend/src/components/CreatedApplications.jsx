import ApplicationCard from "./Applications_Card";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import axios from "axios";
import { useSelector } from "react-redux";


const CreatedApplications = () => {
    
    const [loading, setLoading] = useState()
    const [applications, setApplications] = useState([])
    const user = useSelector(state => state.auth.userData);
    const userID = user?.data?._id
    

    const getAppliedjob = async () =>{
      setLoading(true)
        try {
           const response = await axios.get(`/api/v1/application/getAppliedJobs?userID=${userID}`)
           
           if (response) {
              setApplications(response?.data?.data) 
           }
        } 
        catch (error) {
          console.log(error, "Error Applied fetching jobs");
        }
        finally {
           setLoading(false)
        }
    }

    useEffect(() => {
      getAppliedjob();
    }, []);

  
  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application._id}
            application={application}
            isCandidate={true}
            job={application?.job_id}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;