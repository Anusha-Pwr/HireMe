import React, { useEffect, useState } from "react";
import { getJobs } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import { useSession, useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/JobCard";
import { getCompanies } from "../api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "../components/ui/button";

const JobListing = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: jobsData,
    loading: jobsLoading,
    error,
    fn: fnGetJobs,
  } = useFetch(getJobs, {location, company_id, searchQuery});

  const {
    data: companiesData,
    loading,
    fn: fnGetCompanies,
  } = useFetch(getCompanies);

  const { isLoaded } = useSession();

  useEffect(() => {
    if (isLoaded) {
      fnGetJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  function submitSearchHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) {
      setSearchQuery(query);
    }
  }

  if (!isLoaded)
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* add filters */}
      <form onSubmit={submitSearchHandler} className="h-14 flex gap-2">
        <Input
          type="text"
          placeholder="Search jobs by title..."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" variant="blue" className="h-full sm:w-28">
          Search
        </Button>
      </form>

      {jobsLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#7b68ee" />
      )}

      {!jobsLoading && (
        <div>
          {jobsData?.length ? (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobsData.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  savedInitially={job?.saved?.length > 0}
                />
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
