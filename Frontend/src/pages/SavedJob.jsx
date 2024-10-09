import JobCard from "@/components/JobCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useSelector } from "react-redux";

const SavedJob = () => {
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const user = useSelector(state => state.auth.userData);
  const userID = user.data?._id;


  const getSavedJobs = async () => {
    setLoading(true)
     try {
      const fetchedJobs = await axios.get('/api/v1/job/getSavedJobs', {
         params: { userID }
      })
 
      if (fetchedJobs) {
        setSavedJobs(fetchedJobs.data?.data)
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
    getSavedJobs();
  }, [userID]);

  
  
  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedJobs?.length ? (
          savedJobs.map((saved) => (
            <JobCard
              key={saved._id}
              job={saved}  
              savedInit={saved?.isSaved}
            />
          ))
        ) : (
          <div>No Saved Jobs 👀</div>
        )}
      </div>
    </div>
  );
};

export default SavedJob;