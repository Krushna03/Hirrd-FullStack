import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { login } from "@/context/authSlice";

const Onboarding = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const authStatus = useSelector((state) => state.auth.status)
   const userData = useSelector((state) => state.auth.userData);
   const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelection = async (role) => {
    setIsLoading(true)
      try {
        if (authStatus) {
          const response = await axios.patch('/api/v1/users/updateUserRole', {role})
  
          if (response?.data) {
            dispatch(login({ userData: response.data }))
            navigateUser(response.data.data?.role);
          }       
        }
      } 
      catch (error) {
        console.error("Error updating role:", error);
      }
      finally{
        setIsLoading(false)
      }
  }

  const navigateUser = (role) => {
    console.log(role);
      if (role === "recruiter") {
        navigate('/post-job')
      }
      else if(role === "candidate"){
        navigate("/jobs");
      }
  };
  

  if (isLoading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          className="h-36 text-2xl bg-blue-600"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;