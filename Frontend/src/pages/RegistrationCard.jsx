import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "@/context/authSlice"
import { useState } from "react"
import AuthLoader from "@/loaders/AuthLoader"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


export default function RegistrationCard({ setShowRegister, setShowSignin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post(
        'https://hirrd-backend.vercel.app/api/v1/users/google/callback',
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      
      if (data) {
        const token = data?.accessToken;
        localStorage.setItem('token', JSON.stringify(token));
        dispatch(login({ userData: data }));
        navigate(0);
      }
    } catch (error) {
      console.error('Google Login Error:', error.response?.data || error.message);
      alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google Login failed");
  };

  const submit = async (data) => {
    try {
      const registered = await axios.post('https://hirrd-backend.vercel.app/api/v1/users/registeration', data, {
        withCredentials: true,
      });
      console.log(registered);

      if (registered) {
        localStorage.setItem('token', JSON.stringify(registered?.data?.data?.accessToken));
        dispatch(login({ userData: registered.data }));
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Card className="sign-up-animate w-full max-w-md bg-black text-white border border-gray-800 rounded-xl shadow-2xl mx-7">
        <form onSubmit={handleSubmit(submit)}>
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription className="text-gray-400">Create your account to get started</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                className="bg-gray-900 text-white border-gray-700 focus:border-gray-500 transition-colors duration-300"
                {...register("username", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900 text-white border-gray-700 focus:border-gray-500 transition-colors duration-300"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  },
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="bg-gray-900 text-white border-gray-700 focus:border-gray-500 transition-colors duration-300"
                {...register("password", { required: true })}
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 rounded-md"
              onClick={() => setLoading(true)}
            >
              {loading ? <AuthLoader /> : "Register"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-300">Or continue with</span>
              </div>
            </div>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              type="standard"
              theme="filled_black"
              size="large"
              text="signup_with"
            />

            <div className="text-center text-base">
              Already have an account?{" "}
              <button
                className="text-blue-400 ml-1 font-bold text-base mt-2 hover:underline"
                onClick={() => {
                  setShowRegister(false);
                  setShowSignin(true);
                }}
              >
                Sign in
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </GoogleOAuthProvider>
  );
}
