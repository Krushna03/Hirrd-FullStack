import React, { useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BarLoader } from "react-spinners";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddCompanyDrawer = () => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const onsubmit = async (data) => {
    setLoading(true);
    setError('');

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (data.logo[0].size > maxSize) {
        setError('File size should not exceed 5MB');
        setLoading(false);
        toast.error('File size should not exceed 5MB');
        return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(data.logo[0].type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
        setLoading(false);
        toast.error('Invalid file type');
        return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo_url", data.logo[0]);

    try {
        const response = await axios.post('https://hirrd-backend.vercel.app/api/v1/company/newCompany',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        );

        if (response.data) {
            toast.success("Company added successfully!");
            reset();
        }
    } catch (error) {
        let errorMsg = "Error while adding the company!";
        
        if (error.response?.data?.message) {
            errorMsg = error.response.data.message;
        } else if (error.code === 'ECONNABORTED') {
            errorMsg = 'Upload timed out. Please try again.';
        } else if (!navigator.onLine) {
            errorMsg = 'No internet connection.';
        }
        
        setError(errorMsg);
        toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme='dark'/>
      
      <Drawer>
        <DrawerTrigger>
            <Button type="button" size="sm" variant="secondary">
              Add Company
            </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add a New Company</DrawerTitle>
          </DrawerHeader>

          <form className="flex gap-2 p-4 pb-0">
            {/* Company Name */}
            <Input
              placeholder="Company name"
              {...register("name", { required: "Company name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            {/* Company Logo */}
            <Input
              type="file"
              accept="image/*"
              className="file:text-gray-500"
              {...register("logo", { required: "Company logo is required" })}
            />
            {errors.logo && (
                <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}

            {/* Add Button */}
            <Button
              type="button"
              onClick={handleSubmit(onsubmit)}
              variant="destructive"
              className="w-40"
            >
              Add
            </Button>
          </form>

          {error && <p className="text-red-500 p-4">{error}</p>}

          <DrawerFooter>
            {loading && <BarLoader width={"100%"} color="#36d7b7" />}

            <DrawerClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
            </DrawerClose>

          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default AddCompanyDrawer