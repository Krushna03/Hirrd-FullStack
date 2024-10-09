import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "@/context/authSlice";


const useGetCurrentUser = () => {
  const dispatch = useDispatch(); 

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/v1/users/current-user");
      const user = response.data;

      if (user) {
        dispatch(login(user)); 
      } 
      else {
        dispatch(logout()); 
      }
    } 
    catch (error) {
      console.error("Error while getting user:", error);
      dispatch(logout());
    }
  };

  return getCurrentUser; 
};

export default useGetCurrentUser;
