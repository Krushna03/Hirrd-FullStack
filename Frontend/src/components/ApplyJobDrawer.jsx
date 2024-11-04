import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";


export function ApplyJobDrawer({ user, job, fetchJob, applied = false, onApplicationSubmit }) {
  
  const { register, handleSubmit, control, formState: { errors }, reset,} = useForm();
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const jobID = job?._id
  const userID = user.data?._id
  const name = user.data?.username;

  const onSubmit = async (data) => {
    setLoading(true);

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (data.resume[0].size > maxSize) {
        setError('File size should not exceed 5MB');
        setLoading(false);
        toast.error('File size should not exceed 5MB');
        return;
    }

    const allowedTypes = [ 
      'application/pdf', 
      'application/msword',   
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    ]

    if (!allowedTypes.includes(data.resume[0].type)) {
      setError('Please upload a valid file (PDF, DOC, or DOCX)');
      setLoading(false);
      toast.error('Invalid file type');
      return;
  }

  const formData = new FormData();
  formData.append("name", name);
      formData.append("experience", data.experience);
      formData.append("skills", data.skills);
      formData.append("education", data.education);
  
      if (data.resume && data.resume[0]) {
        formData.append("resume", data.resume[0]);
      } else {
        toast.error("Please upload a resume file.");
        setLoading(false);
        return
      }
  
      formData.append("jobID", jobID);
      formData.append("userID", userID);
      
    try {
      const response = await axios.post("https://hirrd-backend.vercel.app/api/v1/application/createApplication",formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data" 
          },
          withCredentials: true,
        }
      );
  
      if (response.data) {
        toast.success("Job application submitted successfully!");
        reset()
        setIsOpen(false);
        if (onApplicationSubmit) {
          onApplicationSubmit(response.data.data);
        }
        setTimeout(() => {
          navigate(`/jobs/${jobID}`);
        }, 2000);
      } 
      else {
        console.log("Unexpected response:", response);
      }
    } 
     catch (error) {
      console.error("Error applying to the job:", error?.response || error);
      toast.error("Failed to apply for the job. Please try again.");
    } 
     finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} theme='dark'/>

    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className={job?.iOpen && !applied ? "bg-blue-600" : "bg-red-700 text-white font-bold"}
          disabled={!job?.iOpen || applied}
        >
          {job?.iOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company_id?.name}
          </DrawerTitle>
          <DrawerDescription>Please Fill the form below</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {/* {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )} */}
          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}
          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
            />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}
          {/* {errorApply?.message && (
            <p className="text-red-500">{errorApply?.message}</p>
          )} */}
          {loading && <BarLoader width={"100%"} color="#36d7b7" />}
          <Button type="submit" className="bg-blue-700" size="lg">
            Apply
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </>
  );
}