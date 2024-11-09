import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/context/authSlice';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        dispatch(logout());
        return;
      }

      try {
        const response = await axios.get(
          "https://hirrd-backend.vercel.app/api/v1/users/currentUser",
          {
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            withCredentials: true
          }
        );
        
        if (response.data) {
          dispatch(login({ userData: response.data }));
        }
      } catch (error) {
        console.error("Auth error:", error.response?.data || error.message);
        localStorage.removeItem("token");
        dispatch(logout());
      }
    };

    if (!authStatus) {
      checkAuthStatus();
    }
  }, [dispatch, authStatus]);

  
  if (!authStatus) {
    return <Navigate to="/?sign-in=true" />;
  }


  if (authStatus && !userData?.data?.role && pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }


  if (authStatus && userData?.data?.role && pathname === '/onboarding') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;