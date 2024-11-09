import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Edit2, User, Mail, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "@/context/authSlice";
import AuthLoader from "@/loaders/AuthLoader";


const CandidateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setuserDetails] = useState({})
  const user = useSelector(state => state.auth.userData);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userID = user?.data?._id;

  const avatarColor = user?.data?.role === 'candidate' ? 'bg-blue-700' : 'bg-red-700';
  
  const savedJobsCount = user.data?.savedJobs?.length || [];
  let applicationCount = userDetails?.userApplications?.length || [];

  let applied = 0;
  let interviewing = 0;
  let hirred = 0;
  let rejected = 0;

  const applications = userDetails?.userApplications || [];
  applications.map((app) => {
     if (app.status === "Applied") {
        applied += 1;
     }
     else if (app.status === "Interviewing") {
        interviewing += 1;
     }
     else if (app.status === "Hirred") {
        hirred += 1;
     }
     else if (app.status === "Rejected") {
        rejected += 1; 
     }
  })

  useEffect(() => {
    const userDetails = async () => {
      try {
        const response = await axios.get(`https://hirrd-backend.vercel.app/api/v1/users/getUserDeatils`, {params : {userID}} , {
          withCredentials: true 
      })

        if (response) {
          setuserDetails(response.data?.data)
          }
       }
       catch (error) {
         console.log(error, "Error fetching user details");
        } 
     }
     userDetails()
  }, [])

  const userInitial = user.data?.username.charAt(0).toUpperCase();
  const token = localStorage.getItem("token");
  
  const logoutHandler = async () => {
    setLoading(true)
    try {
      const response = await axios.post('https://hirrd-backend.vercel.app/api/v1/users/logout', 
        {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        },
        {
          withCredentials: true,
        }
    )

      if (response.status === 200) {
        dispatch(logout())
        localStorage.removeItem('token')
        navigate('/')
      }
    } catch (error) {
      console.log("logout error", error);
    }
    finally {
      setLoading(false)
    }
  }

  
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-7 space-y-6">
      
          <div className="flex justify-center">
             <div className={`p-4 h-20 w-20 rounded-full flex justify-center text-4xl ${avatarColor}`}>
                  {userInitial}
             </div>
             {/* <Edit size={15} className='mt-14'/> */}
          </div>
        
          <div className="pt-5 flex justify-between lg:px-5 gap-5">
            <div className="space-y-1">
              <p className="text-base text-gray-400 flex gap-1"><User size={22}/>Name</p>
              <p className="font-semibold text-xl flex gap-3 text-gray-100">
                 {user.data?.username} 
                 {/* <Edit size={16} className="mt-1 cursor-pointer"/> */}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-base text-gray-400 flex gap-1"><Mail size={21}/> Email</p>
              <p className="font-semibold text-gray-100 text-lg">{user.data?.email}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700 lg:px-5">
              <h3 className="text-lg font-bold mb-3 text-gray-200">Application Details</h3>
              <p className="text-gray-200 mb-2">Total: {applicationCount}</p>
              <div className="grid lg:grid-cols-2 gap-4">
                {[
                  { label: "Applied", value: applied },
                  { label: "Interviewing", value: interviewing },
                  { label: "Hired", value: hirred },
                  { label: "Rejected", value: rejected },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-gray-300 text-base">{item.label}</p>
                    <p className="text-white text-xl">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>


            <div className="pt-4 border-t border-gray-700 lg:px-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-200">Jobs</h3>
                <div className="flex items-center space-x-1">
                  <Briefcase className="text-blue-400 mr-1" size={18} />
                  <span className="text-blue-400 text-lg font-medium">{savedJobsCount} Saved</span>
                </div>
              </div>
            </div>


          <div className="pt-4">
            <Button className={`w-full ${avatarColor}`} onClick={logoutHandler}>
                  {loading ? <AuthLoader /> :  'logout'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateProfile;