import React, { useEffect, useState } from "react";
import { getJobs } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import { useSession, useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/JobCard";

const JobListing = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: jobsData,
    loading: jobsLoading,
    error,
    fn: fnGetJobs,
  } = useFetch(getJobs);

  const { isLoaded } = useSession();

  console.log(jobsData);

  useEffect(() => {
    if (isLoaded) {
      fnGetJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  if (!isLoaded)
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* add filters */}

      {jobsLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#7b68ee" />
      )}

      {!jobsLoading && (
        <div>
          {jobsData?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobsData.map((job) => (
                <JobCard key={job.id} job={job} savedInitially={job?.saved?.length > 0} />
              ))}
            </div>
          ) : (
            <div>No Jobs Found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
