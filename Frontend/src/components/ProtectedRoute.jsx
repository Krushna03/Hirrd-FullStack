import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login, logout } from '@/context/authSlice';
import axios from 'axios';
import { useSelector } from 'react-redux';


const ProtectedRoute = ({ children }) => {
  
  const [user, setUser] = useState()
  const { pathname } = useLocation()
  const dispatch = useDispatch(); 
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get("/api/v1/users/currentUser");
        
        if (response) {
          setUser(response.data);
          dispatch(login({ userData: response.data }))
        }
      } 
      catch (error) {
        console.error("Error while getting user:", error);
        dispatch(logout());
      }
    };
    getCurrentUser()
  }, [])

   if (!user && !authStatus) {
      return <Navigate to="/?sign-in=true" />
   }

  if(user !== undefined && !userData?.data?.role  && pathname !== '/onboarding') {
    return <Navigate to='/onboarding' />
  }

  if (user && userData?.data?.role && pathname === '/onboarding') {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute