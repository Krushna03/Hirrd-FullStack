import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BarLoader } from "react-spinners";


const MyJobs = () => {

  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.auth.userData)

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {user?.data?.role === "candidate"
          ? "My Applications"
          : "My Jobs"
        }
      </h1>

      {
        user?.data?.role === "candidate" ? (
          <CreatedApplications />
        ) : (
          <CreatedJobs />
        )
      }
    </div>
  );
};

export default MyJobs;