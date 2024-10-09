import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { getMyJobs } from "../api/apiJobs";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingMyJobs,
    data: myJobsData,
    error,
    fn: fnGetMyJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) {
      fnGetMyJobs();
    }
  }, [isLoaded]);

  if (loadingMyJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;
  }

  return (
    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {myJobsData?.length > 0 ? (
        myJobsData?.map((myJob, index) => (
          <JobCard
            key={index}
            job={myJob}
            onSaveJob={fnGetMyJobs}
            isMyJob
          />
        ))
      ) : (
        <div>No Jobs created yet. 👀</div>
      )}
    </div>
  );
};

export default CreatedJobs;
