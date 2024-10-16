import { useEffect, useState } from "react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useSelector } from "react-redux";


const JobListing = () => {
  const [loading, setLoading] = useState(false)
  const [jobloading, setJobLoading] = useState(false)
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [company_Name, setCompany_Name] = useState("");
  const [companies, setCompanies] = useState([])
  const [Jobs, setJobs] = useState([])
  const [savedJob, setSavedJob] = useState([])
  const user = useSelector(state => state.auth.userData)

   const userID = user.data?._id;

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


   const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('/api/v1/job/getJobsBySearch', {
        params: { title, location, company_Name },
      });

      if (response?.data?.data) {
        const searchedJobsWithSavedStatus = response.data.data.map(job => ({
          ...job,
          isSaved: savedJob.some(saved => saved._id === job._id)
        }));
        setJobs(searchedJobsWithSavedStatus);
      }
    } 
    catch (error) {
      console.log(error, "Error while fetching the searched jobs");
    }
  }


   const clearFilters = () => {
     setTitle("");
     setCompany_Name("");
     setLocation("");
   }


   useEffect(() => {
    const initializeData = async () => {
      setJobLoading(true);
      try {
        const savedResponse = await axios.get('/api/v1/job/getSavedJobs', {
          params: { userID }
        });
        if (savedResponse.data.data) {
          setSavedJob(savedResponse.data.data);
        }
        
        await getCompanies();
        const jobsResponse = await axios.get('/api/v1/job/getJobs');
        
        if (jobsResponse?.data?.data) {
          const jobsWithSavedStatus = jobsResponse.data.data.map(job => ({
            ...job,
            isSaved: savedResponse.data.data.some(
              saved => saved._id === job._id
            )
          }));
          setJobs(jobsWithSavedStatus);
        }
      } catch (error) {
        console.log(error, "Error initializing data");
      } finally {
        setJobLoading(false);
      }
    };

    initializeData();
  }, [userID]);



   const handleJobSaved = (jobId, isSaved) => {
    setSavedJob(prev => {
      if (isSaved) {
        return prev.filter(saved => saved._id !== jobId);
      } 
      else {
        return [...prev, { _id: jobId }];
      }
    });

    setJobs(prev => prev.map(job => 
      job._id === jobId ? { ...job, isSaved: !isSaved } : job
    ));
  };


  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      <form
        onSubmit={handleSearch}
        className="h-14 flex flex-row w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          className="h-full flex-1  px-4 text-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" className="h-full bg-blue-600 sm:w-28">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_Name} onValueChange={(value) => setCompany_Name(value)}>
          
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {companies?.map((company) => {
                return (
                  <SelectItem key={company._id} value={company.name}>
                    {company.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Button className="sm:w-1/2" variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {jobloading && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {jobloading === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Jobs?.length ? (
            Jobs.map((job) => {
              return (
                <JobCard
                  key={job._id}
                  job={job}
                  savedInit={job.isSaved} 
                  onJobSaved={handleJobSaved}
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;