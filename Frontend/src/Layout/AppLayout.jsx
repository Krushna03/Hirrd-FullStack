import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { logout, login } from '@/context/authSlice'
import { BarLoader } from 'react-spinners'

const AppLayout = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);  


  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      const validateTokenAndFetchUser = async () => {
        try {
          const response = await axios.get("https://hirrd-backend.vercel.app/api/v1/users/currentUser", {
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
          },{
            withCredentials: true 
        });

          if (response) {
            dispatch(login({ userData: response.data })); 
          }
        } 
        catch (error) {
          console.error("Error while validating token:", error);
          dispatch(logout()); 
        } 
        finally {
          setLoading(false); 
        }
      };

      validateTokenAndFetchUser();
    } else {
      // No token present, set loading to false directly
      setLoading(false);
    }
  }, [dispatch]);

  
  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with ❤️ by Dev Krushna Sakahare
      </div>
    </div>
  );
};

export default AppLayout;
