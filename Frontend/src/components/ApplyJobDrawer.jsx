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


export function ApplyJobDrawer({ user, job, fetchJob, applied = false }) {
  
  const { register, handleSubmit, control, formState: { errors }, reset,} = useForm();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const jobID = job?._id
  const userID = user.data?._id
  const name = user.data?.username;


  // const {
  //   loading: loadingApply,
  //   error: errorApply,
  //   fn: fnApply,
  // } = UseFetch(applyToJob);

  // const onSubmit = (data) => {
  //   fnApply({
  //     ...data,
  //     job_id: job.id,
  //     candidate_id: user.id,
  //     name: user.fullName,
  //     status: "applied",
  //     resume: data.resume[0],
  //   }).then(() => {
  //     fetchJob();
  //     reset();
  //   });
  // };
   

   const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('name', name);                     
      formData.append('experience', data.experience);
      formData.append('skills', data.skills);
      formData.append('education', data.education);
      formData.append('resume', data.resume[0]);    
      formData.append('jobID', jobID)  
      formData.append('userID', userID)

      const response = await axios.post('/api/v1/application/createApplication',formData)
      if (response) {
        console.log(response);
        toast.success("Job created successfully!")
        navigate(`/jobs/${jobID}`)
      }
    } catch (error) {
      console.log(error, "Error applying to the job");
    }
    finally {
       setLoading(false)
    }
   }

  return (
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
  );
}