import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { getSavedJobs } from "../api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    error,
    data: savedJobsData,
    fn: fnGetSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnGetSavedJobs();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobsData?.length > 0 ? (
            savedJobsData?.map((savedJob, index) => (
              <JobCard key={index} job={savedJob.job} savedInitially={true} onSaveJob={fnGetSavedJobs} />
            ))
          ) : (
            <div>No Saved Jobs. 👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
