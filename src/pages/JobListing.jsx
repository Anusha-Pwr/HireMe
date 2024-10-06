import React, { useEffect } from "react";
import { getJobs } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import { useSession, useUser } from "@clerk/clerk-react";

const JobListing = () => {
  const {
    data: jobsData,
    loading: jobsLoading,
    error,
    fn: fnGetJobs,
  } = useFetch(getJobs);

  const {isLoaded} = useSession();

  console.log(jobsData);

  useEffect(() => {
    if(isLoaded) {
      fnGetJobs();
    }
  
  }, [isLoaded]);

  return <div>JobListing</div>;
};

export default JobListing;
