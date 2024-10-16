import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ApplyJobDrawer} from "@/components/ApplyJobDrawer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import ApplicationCard from "@/components/Applications_Card";


const JobPage = () => {

  const [loading, setLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [applications, setApplications] = useState([])
  const [job, setJob] = useState()
  const { jobId } = useParams()
  const user = useSelector(state => state.auth.userData)
  const userID = user.data?._id;
  


  const getAppications = async () => {
    try {
      const response = await axios.get(`/api/v1/application/getApplications?jobId=${jobId}`);
  
      if (response) {
        setApplications(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };


  const handleStatusChange = async (value) => {
    setStatusLoading(true)
    const iOpen = value === "open"; 
    try {
      const updateJobStatus = await axios.patch(`/api/v1/job/getJobById/${jobId}/updateJobStatus`, {iOpen});
      
      setJob(prevJob => ({
        ...prevJob, iOpen: iOpen
      }))

    } catch (error) {
      console.error("Error updating job status:", error);
    }
    finally {
       setStatusLoading(false)
    }
  };


  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true)
      try {
        const job = await axios.get(`/api/v1/job/getJobById/${jobId}`)
        if (job) {
          setJob(job.data?.data)
        }
      } 
      catch (error) {
        console.log(error, "Error fetching a job"); 
      }
      finally {
        setLoading(false)
      }
    }
    fetchJob()
    getAppications()
  }, [jobId])
  

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company_id?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between ">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.iOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {job?.recuriter_id === user?.data?._id && (
        <div className="relative">
          {statusLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
              <BarLoader color="#36d7b7" />
            </div>
          )}
          <div className="font-bold text-xl pb-3">
            Hiring Status
          </div>
          <Select onValueChange={handleStatusChange} value={job?.iOpen ? "open" : "closed"}>
            <SelectTrigger className={`w-full ${job?.iOpen ? "bg-green-950" : "bg-red-950"}`}>  
              <SelectValue
                placeholder={(job?.iOpen ? "( Open )" : "( Closed )")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>

      <MDEditor.Markdown 
        source={job?.requirement}
        className="bg-transparent text-white sm:text-lg wmde-markdown"
      />

      {job?.recuriter_id !== user?.data?._id && user?.data?.role !== 'recruiter' && (
        <ApplyJobDrawer
          job={job}
          user={user}
          applied={applications?.find((app) => app.candidate_id === user?.data?._id)} 
        />
      )} 
      
      {applications?.length > 0 && job?.recuriter_id === userID && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {applications.map((application) => {
            return (
              <ApplicationCard key={application._id} application={application} job={job}/>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobPage;