import AddCompanyDrawer from "@/components/AddCompanyDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createJOB } from "@/context/jobSlice";


const PostJob = () => {

  const navigate = useNavigate();
  const [loading, setloading] = useState(false)
  const [companies, setCompanies] = useState([])
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.userData)


  if (userData.data?.role !== "recruiter" ) {
     return <Navigate to='/jobs' />
  }

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { 
      location: "", 
      company_Name: "", 
      requirement: "" 
    },
  });


  const getCompanies = async () => {
     try {
      const response = await axios.get("/api/v1/company/getCompanies")

      if (response) {
        setCompanies(response.data?.data)
      }
     } catch (error) {
       console.log(error, "Error fetching the companies");
     }
  }


  const onSubmit = async (data) => {
    setloading(true)
    try {
      const response = await axios.post('/api/v1/job/createJob', data)
  
      if (response) {
         dispatch(createJOB({ jobData: response.data }))
         toast.success("Job created successfully!")
         
         setTimeout(() => {
          navigate('/jobs');
        }, 2000); 
      }
    } 
    catch (error) {
       console.log(error, "Error creating Job");
       toast.error(error)
    }
    finally {
       setloading(false)
    }
  }

  
  useEffect(()=> {
    getCompanies()
  }, [companies])


  return (
    <>
       <ToastContainer position="top-right" autoClose={3000} theme='dark'/>
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            />
          <Controller
            name="company_Name"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {
                     field.value ? 
                      companies?.find((com) => com.id === Number(field.value))?.name
                      : "Company"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      companies.map((company) => (
                        <SelectItem key={company._id} value={company.name}>
                           {company.name}
                        </SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirement"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirement && (
          <p className="text-red-500">{errors.requirement.message}</p>
        )}
        {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {/* {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )} */}
        {loading && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" className="bg-blue-700 mt-2" size="lg">
          Submit
        </Button>
      </form>
    </div>
  </>
  );
};

export default PostJob;