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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



const RecruiterProfile = () => {
  const [loading, setLoading] = useState(false);
  const [recruiterDetails, setrecruiterDetails] = useState({})
  const user = useSelector(state => state.auth.userData);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // console.log(user);
  // console.log(recruiterDetails);
  
  const userID = user?.data?._id;
  const userInitial = user.data?.username.charAt(0).toUpperCase();
  const avatarColor = user?.data?.role === 'candidate' ? 'bg-blue-700' : 'bg-red-700';
  const savedJobsCount = user.data?.savedJobs?.length || [];

  const applications = recruiterDetails?.applications || [];
  let applied = 0;

  const jobs = recruiterDetails?.myJobs || [];


  useEffect(() => {
    const recruiterDetails = async () => {
      try {
        const response = await axios.get(`https://hirrd-backend.vercel.app/api/v1/users/getRecruiterDetails`, {params : {userID}}, {
          withCredentials: true 
      })
      
        if (response) {
          setrecruiterDetails(response.data?.data)
          }
       }
       catch (error) {
         console.log(error, "Error fetching user details");
        } 
     }
     recruiterDetails()
  }, [])

  
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
    <div className="flex items-center justify-center md:p-4">
    <Card className="w-full md:max-w-2xl">
      <CardContent className="p-7 space-y-6">
    
        <div className="flex justify-center">
           <div className={`p-2 md:p-4 h-14 w-14 md:h-20 md:w-20 rounded-full flex justify-center text-4xl ${avatarColor}`}>
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
            <h3 className="text-lg font-bold mb-3 text-gray-200">Jobs Details</h3>
            <div className="grid lg:grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div key={job._id} className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-300 text-base">{job.title} - </p>
                  <p className="text-white text-xl">
                     { 0 }
                  </p>
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
          <Button className={`w-full hover:bg-red-600 ${avatarColor}`} onClick={logoutHandler}>
                {loading ? <AuthLoader /> :  'logout'}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

export default RecruiterProfile;