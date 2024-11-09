import ApplicationCard from "./Applications_Card";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const CreatedApplications = () => {
    
    const [loading, setLoading] = useState()
    const [applications, setApplications] = useState([])
    const user = useSelector(state => state.auth.userData);
    const userID = user?.data?._id
    const navigate = useNavigate()

    const getAppliedjob = async () =>{
      setLoading(true)
        try {
           const response = await axios.get(`https://hirrd-backend.vercel.app/api/v1/application/getAppliedJobs?userID=${userID}`, {
            withCredentials: true 
        })
           
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
    <div className="flex flex-col gap-2 lg:mx-8">
      {applications && applications.length > 0 ? (
        applications.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            isCandidate={true}
            job={application?.job_id}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center mt-16">
          <div className="text-center text-gray-400 text-2xl mb-4">
            No applications found 😢
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Explore Jobs
          </button>
        </div>
      )}
    </div> 
  );  
};

export default CreatedApplications;