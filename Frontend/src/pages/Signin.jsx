import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useDispatch } from "react-redux"
import { login } from "@/context/authSlice"
import { useState } from "react"
import AuthLoader from "@/loaders/AuthLoader"
import { useNavigate } from "react-router-dom"


export default function SignIn({ setShowRegister, setShowSignin }) {

  const [loading, setLoading] = useState(false)
  const {register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const signIn = async (data) => {
    try {
      const signin = await axios.post("https://hirrd-backend.vercel.app/api/v1/users/signIn", data, {
        withCredentials: true 
    });
    
      if (signin) {
        dispatch(login({ userData : signin.data }))
        navigate(0)
      }
      localStorage.setItem('token', JSON.stringify(signin?.data?.data?.accessToken))
    } 
    catch (error) {
      console.log("Error in sigin", error);
    }
    finally {
       setLoading(false)
    }
  }

  return (
      <Card className="sign-up-animate w-full max-w-md bg-black text-white border border-gray-800 rounded-xl shadow-2xl">
        
        <form onSubmit={handleSubmit(signIn)}>
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-900 text-white border-gray-700 focus:border-gray-500 transition-colors duration-300" 
                {...register("email", {
                  required: true,
               })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password" }
                placeholder="Enter your password" 
                className="bg-gray-900 text-white border-gray-700 focus:border-gray-500 transition-colors duration-300" 
                {...register("password", {
                  required: true
                })}
              />

              <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="showPassword"
                className="accent-blue-500"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <Label htmlFor="showPassword" className="text-gray-300 text-sm">Show Password</Label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
               type="submit" 
               className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white transition-all duration-300 rounded-md"
               onClick={() => setLoading(true)}
            >
              { 
                loading ? <AuthLoader/> : "Sign In"
              }
            </Button>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-300">Or continue with</span>
              </div>
            </div> */}

            {/* <Button 
              type="button"
              variant="outline" 
              className="w-full bg-gray-900 text-white border-gray-700 hover:bg-gray-800 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
                 Sign in with Google
            </Button> */}
            
            <div className="text-center text-base">
              Don't have an account?{" "}
              <button 
                onClick={() => {
                  setShowSignin(false);
                  setShowRegister(true);
                }}
                className="text-blue-400 ml-1 font-bold text-base mt-2 hover:underline"
              >
                Sign up
              </button>
            </div>
            
          </CardFooter>
        </form>
      </Card>
  )
}