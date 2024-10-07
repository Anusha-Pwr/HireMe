import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { saveJob } from "../api/apiJobs";
import { useUser } from "@clerk/clerk-react";

const JobCard = ({
  job,
  isMyJob = false,
  savedInitially = false,
  onSaveJob = () => {},
}) => {
  const [saved, setSaved] = useState(savedInitially); // state to display whether the job is saved or not

  const { user } = useUser();

  const {
    data: savedJob,
    loading: loadingSavedJob,
    error,
    fn: fnSaveJob,
  } = useFetch(saveJob, saved);

  useEffect(() => {
    if (savedJob !== undefined) {
      setSaved(savedJob?.length > 0); // if savedJob is not an array of objects (job deleted from saved jobs), saved is set to false
    }
  }, [savedJob]);

  async function saveJobHandler() {
    await fnSaveJob({
      user_id: user.id,
      job_id: job.id,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        <div>{job.description}</div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={saveJobHandler}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} stroke="red" fill="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
