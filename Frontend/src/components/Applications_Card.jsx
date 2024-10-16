import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const ApplicationCard = ({ application, job }) => {
    
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(application?.status);
    const user = useSelector(state => state.auth.userData)
    const isCandidate = user?.data?.role === 'candidate'
    const jobID = job?._id
    
    console.log(application?.resume);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    };

        
    const handleStatusChange = async (status) => {
      setLoading(true)
      try {
        const response = await axios.put(`/api/v1/application/changeApplicationStatus?jobID=${jobID}&status=${status}`);
        
        if (response) {
          console.log(response.data?.data?.status);
          setStatus(response.data?.data?.status)
        }
        
      } catch (error) {
         console.error("Failed to update status:", error);
      }
      finally {
        setLoading(false)
      }              
   }


  return (
    <Card>
      {loading && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${job?.title} at ${job?.company_id?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} /> {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} />
            Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.createdAt).toLocaleString()}</span>
        
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application?.status}
          </span>
        ) : (
          <Select
             defaultValue={status}
             onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;