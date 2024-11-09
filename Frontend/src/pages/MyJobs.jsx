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
    <div className="lg:mx-10">
      <h1 className="gradient-title font-extrabold lg:text-6xl text-3xl md:text-4xl text-center pb-8 mt-3">
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