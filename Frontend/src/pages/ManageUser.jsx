import CandidateProfile from "@/components/CandidateProfile";
import RecruiterProfile from "@/components/RecruiterProfile";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BarLoader } from "react-spinners";


const ManageUser = () => {

  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.auth.userData)

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-6xl text-center pb-7">
        {user?.data?.role === "candidate"
          ? "Manage Candidate"
          : "Manage Recruiter"
        }
      </h1>

      {
        user?.data?.role === "candidate" ? (
          <CandidateProfile />
        ) : (
          <RecruiterProfile />
        )
      }
    </div>
  );
};

export default ManageUser;