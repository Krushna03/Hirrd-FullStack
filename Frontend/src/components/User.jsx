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


export default function User() {

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const registeredUser = JSON.parse(localStorage.getItem('authToken'));

  let userInitial = '';
  if (registeredUser.data?.username) {
    userInitial = registeredUser.data?.username.charAt(0).toUpperCase();
  }


  const logoutHandler = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/v1/users/logout')
      if (response) {
        navigate(0)
        dispatch(logout())
      }
    } catch (error) {
      console.log("logout error", error);
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className=" flex items-center gap-3">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          
          <Button variant='ghost' className="relative h-12 w-12 rounded-full p-0">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-2xl font-semibold text-white">{userInitial}</AvatarFallback>
            </Avatar>
          </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className="user-card bg-dark-gray text-gray-300 rounded-xl shadow-lg p-0 overflow-hidden" align="end" 
        >
          <div className="bg-dark-gray flex items-center gap-3 p-4 border-bottom border-btm">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-3xl font-semibold text-white">{userInitial}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="font-semibold text-base text-white">
              {userInitial + registeredUser.data?.username?.slice(1)}
              </p>
              <p className="text-sm text-gray-300">
                {registeredUser.data?.email}
              </p>
            </div>
          </div>

          <div className="py-1">
            <DropdownMenuItem className="py-4 px-7 focus:bg-[#2a2a2a] focus:text-white border-btm">
              <Settings className="mr-5 h-4 w-4" /> 
               Manage account
            </DropdownMenuItem>
            
            <DropdownMenuItem className="py-4 px-7 focus:bg-[#2a2a2a] focus:text-white border-btm">
              <Briefcase className="mr-5 h-4 w-4" /> 
                <Link onClick={() => {
                     navigate('/my-jobs')
                     navigate(0)
                  }}
                >
                  My Jobs
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="py-4 px-7 focus:bg-[#2a2a2a] focus:text-white border-btm">
              <Heart className="mr-5 h-4 w-4" /> 
                <Link onClick={() => {
                     navigate('/saved-jobs')
                     navigate(0)
                  }}
                >
                  Saved Jobs
                </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="py-4 px-7 focus:bg-[#2a2a2a] focus:text-white border-btm">
              {loading ? <SignOut /> : <LogOut className="mr-5 h-4 w-4" /> }
                <Link onClick={logoutHandler}>
                  Sign out
                </Link>
            </DropdownMenuItem>

          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}