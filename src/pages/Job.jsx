import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { getSingleJob, updateHiringStatus } from "../api/apiJobs";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "../components/ApplyJobDrawer";
import ApplicationCard from "../components/ApplicationCard";

const Job = () => {
  const { id } = useParams();

  const { user, isLoaded } = useUser();

  const {
    data: jobData,
    loading: jobLoading,
    error,
    fn: fnGetSingleJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const { loading: hiringStatusLoading, fn: fnUpdateHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  useEffect(() => {
    if (isLoaded) {
      fnGetSingleJob();
    }
  }, [isLoaded]);

  async function hiringStatusHandler(value) {
    const isOpen = value === "open";
    await fnUpdateHiringStatus(isOpen);
    fnGetSingleJob();
  }

  if (!isLoaded || jobLoading) {
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;
  }

  return (
    <div className="mt-5 flex flex-col gap-8">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {jobData?.title}
        </h1>
        <img
          src={jobData?.company?.logo_url}
          alt={jobData?.company?.name}
          className="h-12"
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {jobData?.location}
        </div>

        <div className="flex gap-2">
          <Briefcase />
          {jobData?.applications?.length}{" "}
          {`Applicant${jobData?.applications?.length === 1 ? "" : "s"}`}
        </div>

        <div className="flex gap-2">
          {jobData?.isOpen ? (
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

      {/* hiring status */}
      {hiringStatusLoading && (
        <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />
      )}
      {jobData?.recruiter_id === user?.id && (
        <Select onValueChange={hiringStatusHandler}>
          <SelectTrigger
            className={`w-full ${
              jobData?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={`Hiring Status ${
                jobData?.isOpen ? "(Open)" : "(Closed)"
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{jobData?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for?
      </h2>
      <MDEditor.Markdown
        source={jobData?.requirements}
        className="bg-transparent"
      />

      {/* render applications */}
      {jobData?.recruiter_id !== user?.id && ( // show the job application drawer if user is not a recruiter
        <ApplyJobDrawer
          job={jobData}
          user={user}
          fetchJob={fnGetSingleJob}
          applied={jobData?.applications?.find(
            (application) => application?.candidate_id === user?.id
          )}
        />
      )}

      {jobData?.recruiter_id === user?.id &&
        jobData?.applications.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Applications</h2>
            {jobData?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
    </div>
  );
};

export default Job;
