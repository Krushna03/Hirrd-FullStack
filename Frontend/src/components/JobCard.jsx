import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Heart, MapPinCheck, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { BarLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import axios from 'axios';


const JobCard = ({ job, isMyJob=false, savedInit, onJobSaved=()=>{}, onJobDeleted=()=>{} }) => {

   const [laoding, setLoading] = useState(false)
   const [saved, setSaved] = useState(savedInit)
   const user = useSelector(state => state.auth.userData)

   const userID = user.data?._id;
   const jobID = job?._id


   const handleSavedJobs = async () => {
   if (saved === true) {
      setLoading(true)
         try {
            const response = await axios.delete('/api/v1/job/unSaveJob', {
               data: { jobID }
            })
   
            if (response.status === 200) {
               setSaved(false)
               onJobSaved(jobID, false)
            }
         } 
         catch (error) {
            console.log(error, "Error unSaveJob");
         }
         finally {
            setLoading(false)
         }
      } 
      else {
        setLoading(true)
        try {
          const response = await axios.post('/api/v1/job/createSavedJob', {
             userID, 
             jobID
          })
          
          if (response.data.success) {
             setSaved(true)
             onJobSaved(jobID, true)
          }
        } 
        catch (error) {
            console.log(error, "Error createSavedJob");
        }
        finally {
            setLoading(false)
        }
      }
    }


    const handleDeleteJob = async () => {
        setLoading(true)
        try {
          const response = await axios.delete(`/api/v1/job/deleteJob?jobID=${jobID}`)
          if (response) {
             onJobDeleted(jobID);
          }
        } catch (error) {
           console.log(error,"Error deleting the job");
        }
        finally {
         setLoading(false)
        }
    }


   useEffect(() => {
      setSaved(savedInit)
   }, [savedInit])



  return (
    <Card className="flex flex-col">
       
      {laoding && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
       
      <CardHeader>
         <CardTitle className="flex justify-between font-bold">
            {job?.title}

            {isMyJob && (
              <Trash2Icon 
                fill='red'
                size={18}
                className='text-red-300 cursor-pointer'
                onClick={handleDeleteJob}
              />
            )}
         </CardTitle>
      </CardHeader>

       <CardContent className="flex flex-col gap-4 flex-1">
          <div className='flex justify-between'>
             {job?.company_id && 
               <img src={job.company_id?.logo_url} className='h-6'/>
             }

             <div className='flex gap-2 items-center'>
               <MapPinCheck size={15} /> {job?.location}
             </div>
          </div>
          
          <hr />
          {job?.description.substring(0, job?.description.indexOf("."))}
       </CardContent>

       <CardFooter className="flex gap-2">
          <Link to={`/jobs/${job?._id}`} className="flex-1">
             <Button className="w-full" variant="secondary">
                More Details
             </Button>
          </Link>

          {!isMyJob && (
            <Button
              variant="outline"
              className="w-15"
              onClick={handleSavedJobs}
              disabled={laoding}

            >
               <Heart 
                 size={20} 
                 stroke={saved ? 'red' : 'currentColor'} 
                 fill={saved ? 'red' : 'none'}
               />
            </Button>
          )}
       </CardFooter>
    </Card>
  )
}

export default JobCard