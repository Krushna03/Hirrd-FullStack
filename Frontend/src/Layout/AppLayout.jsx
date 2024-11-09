import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, Link } from 'react-router-dom'
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


  const github = () => {
     const link = document.createElement('a')
     link.href = 'https://github.com/Krushna03'
     link.target = '_blank'
     link.click()
  }
  
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
        Made with ❤️ by Dev  
        <p onClick={github} className='cursor-pointer font-semibold font-sans hover:underline'>
          Krushna Sakahare
        </p>
      </div>
    </div>
  );
};

export default AppLayout;
