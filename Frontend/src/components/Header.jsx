import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import RegistrationCard from '@/pages/RegistrationCard'
import SignIn from '@/pages/Signin'
import User from './User'
import { PenBox } from 'lucide-react'
import { useSelector } from 'react-redux'


const Header = () => {
  const [ ShowRegister, setShowRegister ] = useState(false)
  const [ ShowSignin, setShowSignin ] = useState(false)
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const [search, setSearch] = useSearchParams()


  const handleOverLayClick = (e) => {
     if (e.target === e.currentTarget) {
       setShowRegister(false)
       setShowSignin(false)
       setSearch({})
     }
  }

  
  useEffect(() => {
    if (search.get('sign-in')) {
       setShowSignin(true) 
    }
  }, [search])
  

  const buttons = [
    {
      label: "Register",
      onClick: () => setShowRegister(true),
    },
    {
      label: "Login",
      onClick: () => setShowSignin(true),
    },
  ];
  

  return (
     <>
       <nav className='py-4 lg:mx-10 flex justify-between items-center'>
         <Link>
            <img src="/logo.png" alt="logo" className='h-20' />
         </Link>
        
         <div className='flex gap-3'>
          {
            !authStatus && 
            buttons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))
          }

          {
            userData && userData?.data?.role === "recruiter" && (
              <Link to='/post-job'>
                <Button 
                  variant='destructive' 
                  className="rounded-full sm:hidden mt-1 lg:mr-3 mr-1"
                  size="icon"
                >
                  <PenBox size={20} />
                </Button>

                <Button 
                  variant='destructive' 
                  className="rounded-full hidden sm:flex items-center mt-1 mr-3"
                >
                  <PenBox size={20} className='mr-1'/>
                  Post a Job
                </Button>
              </Link>
            )
          }
           
          {
            authStatus && (
               <User />
            )
          }
         </div>
       </nav>


      
       {
         ShowRegister && !authStatus && (
           <div onClick={handleOverLayClick}
              className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80'
           >
             <RegistrationCard setShowRegister={setShowRegister} setShowSignin={setShowSignin}/>
           </div>
         )
       }

       {
         ShowSignin && !authStatus && (
           <div onClick={handleOverLayClick}
              className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80'
           >
             <SignIn setShowRegister={setShowRegister} setShowSignin={setShowSignin}/>
           </div>
         )
       }
     </>

  )
}

export default Header