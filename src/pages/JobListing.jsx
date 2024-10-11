import React, { useEffect, useState } from "react";
import { getJobs } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import { useSession, useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/JobCard";
import { getCompanies } from "../api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "../components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { State } from "country-state-city";

const JobListing = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentpage, setCurrentPage] = useState(1); // state for pagination
  const jobsPerPage = 1;

  const {
    data: jobsData,
    loading: jobsLoading,
    error,
    fn: fnGetJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const {
    data: companiesData,
    loading,
    fn: fnGetCompanies,
  } = useFetch(getCompanies);

  const { isLoaded } = useSession();

  useEffect(() => {
    if (isLoaded) {
      fnGetCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setCurrentPage(1);  // set currentPage to 1 whenever the filters change
      fnGetJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  const filteredJobs = jobsData || [];
  const totalJobs = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Paginate the filteredJobsData
  const indexOfLastJob = currentpage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs?.slice(indexOfFirstJob, indexOfLastJob);

  function submitSearchHandler(e) {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const query = formData.get("search-query");
    // if (query) {
    //   setSearchQuery(query);
    // }
  }

  function clearFiltersHandler() {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  }

  function pageChangeHandler(page) {
    setCurrentPage(page);
  }

  if (!isLoaded)
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* add filters */}
      <form onSubmit={submitSearchHandler} className="h-14 flex gap-2 mb-3">
        <Input
          type="text"
          placeholder="Search jobs by title..."
          name="search-query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" variant="blue" className="h-full sm:w-28">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem value={name} key={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companiesData?.map(({ name, id }) => (
                <SelectItem value={id} key={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          onClick={clearFiltersHandler}
          className="sm:w-1/2"
        >
          Clear Filters
        </Button>
      </div>

      {jobsLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#7b68ee" />
      )}

      {!jobsLoading && (
        <div>
          {currentJobs?.length ? (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentJobs?.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  savedInitially={job?.saved?.length > 0}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4">No Jobs Found. 👀</div>
          )}
        </div>
      )}

      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => {
                pageChangeHandler(currentpage - 1);
              }}
              className={
                currentpage === 1
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : ""
              }
            />
          </PaginationItem>

          {/* dynamic pagination links */}
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={index + 1 === currentpage}
                onClick={() => pageChangeHandler(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => pageChangeHandler(currentpage + 1)}
              className={
                currentpage === totalPages
                  ? "pointer-events-none opacity-50 cursor-not-allowed"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default JobListing;
