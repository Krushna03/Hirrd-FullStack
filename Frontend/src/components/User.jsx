import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Settings, Briefcase, Heart, LogOut } from "lucide-react"
import axios from "axios"
import { logout } from "@/context/authSlice"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import SignOut from "@/loaders/SignOut"
import { useSelector } from "react-redux"


export default function User() {

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.userData);

  const registeredUser = JSON.parse(localStorage.getItem('authToken'));

  let userInitial = '';
  if (registeredUser?.data?.username) {
    userInitial = registeredUser?.data?.username.charAt(0).toUpperCase();
  }

  const avatarColor = user?.data?.role === 'candidate' ? 'bg-blue-700' : 'bg-red-700';
  const isCandidate = user?.data?.role === 'candidate' ? 'Applications' : 'Jobs'
 
  
  const logoutHandler = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post('https://hirrd-backend.vercel.app/api/v1/users/logout', 
        {
          headers: { Authorization: `Bearer ${JSON.parse(token)}`},
        },
        {withCredentials: true,}
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
    <div className="flex items-center gap-3">
    
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`${avatarColor} relative h-12 w-12 rounded-full transition-all duration-200 cursor-pointer border border-white hover:${avatarColor}`}
        >
          <p className={`h-11 w-12 flex justify-center items-center ${avatarColor}`}>
            <p className="text-2xl md:text-2xl font-semibold text-white">
              {userInitial}
            </p>
          </p>   
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="user-card bg-dark-gray text-gray-300 rounded-xl shadow-lg p-0 overflow-hidden w-[270px] md:w-[320px] lg:w-[340px] h-[289px] lg:h-[301px]" 
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center gap-3 p-3 md:p-4 border-bottom border-btm">
          <Button className={`h-10 w-10 md:h-12 md:w-12 rounded-full border border-white ${avatarColor} hover:${avatarColor}`}>
            <p className="text-2xl md:text-2xl font-semibold text-white">
              {userInitial}
            </p>
          </Button>

          <div className="flex flex-col">
            <p className="font-semibold text-lg md:text-base text-white truncate max-w-[180px] md:max-w-[220px]">
              {userInitial + registeredUser?.data?.username?.slice(1)}
            </p>
            <p className="text-xs md:text-sm font-medium md:font-normal text-gray-300 truncate max-w-[180px] md:max-w-[220px]">
              {registeredUser?.data?.email}
            </p>
          </div>
        </div>

        <div className="py-0">
          <DropdownMenuItem 
            className="py-4 px-6 md:px-8 focus:bg-[#2a2a2a] focus:text-white border-btm text-base font-semibold"
          >
            <Settings className="mr-3 md:mr-5 h-5 w-5"/> 
            <Link 
              onClick={() => {
                navigate('/manage-user');
                navigate(0);
              }}
              className="w-full"
            >
              Manage account
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="py-4 px-6 md:px-8 focus:bg-[#2a2a2a] focus:text-white border-btm text-base font-semibold"
          >
            <Briefcase className="mr-3 md:mr-5 h-5 w-5" /> 
            <Link 
              onClick={() => {
                navigate('/my-jobs');
                navigate(0);
              }}
              className="w-full"
            >
              My {isCandidate}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="py-4 px-6 md:px-8 focus:bg-[#2a2a2a] focus:text-white border-btm text-base font-semibold"
          >
            <Heart className="mr-3 md:mr-5 h-5 w-5" /> 
            <Link 
              onClick={() => {
                navigate('/saved-jobs');
                navigate(0);
              }}
              className="w-full "
            >
              Saved Jobs
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="py-3 px-7 md:px-9 focus:bg-[#2a2a2a] focus:text-white border-btm text-base font-semibold"
          >
            {loading ? <SignOut className="mr-3 md:mr-5 h-5 w-5" /> : <LogOut className="mr-3 md:mr-5 h-4 w-4" />}
            <Link 
              onClick={logoutHandler}
              className="w-full"
            >
              Sign out
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
     </DropdownMenu>
   </div>
  )
}