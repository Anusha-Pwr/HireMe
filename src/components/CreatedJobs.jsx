import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { getMyJobs } from "../api/apiJobs";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import StatusCard from "./StatusCard";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();

  const [applicationStatus, setApplicationStatus] = useState("All"); // for tracking filled jobs or in-progress jobs
  const [jobStatus, setJobStatus] = useState("All"); // for tracking open and closed jobs
  const [activeFilter, setActiveFilter] = useState("All"); // for tracking the active filter

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

  const openJobsCount = myJobsData?.filter(
    (myJob) => myJob?.isOpen === true
  ).length;
  const closedJobsCount = myJobsData?.filter(
    (myJob) => myJob?.isOpen === false
  ).length;

  const inProgressCount = myJobsData?.filter((myJob) =>
    myJob?.applications?.some(
      (application) => application.status === "interviewing"
    )
  ).length;

  const filledCount = myJobsData?.filter((myJob) =>
    myJob?.applications?.some((application) => application.status === "hired")
  ).length;

  // filteredJobs based on the active filter and jobStatus or applicationStatus
  const filteredJobs = myJobsData?.filter((myJob) => {
    if (activeFilter === "jobStatus") {
      if (jobStatus === "open") return myJob?.isOpen;
      if (jobStatus === "closed") return !myJob?.isOpen;
    }

    if (activeFilter === "applicationStatus") {
      if (applicationStatus === "in-progress") {
        return myJob?.applications?.some(
          (application) => application?.status === "interviewing"
        );
      }

      if (applicationStatus === "filled") {
        return myJob?.applications?.some(
          (application) => application.status === "hired"
        );
      }
    }

    return true;
  });

  function jobStatusHandler(status) {
    // set the activeStatus alongwith the jobStatus
    setActiveFilter("jobStatus");
    setJobStatus(status);
  }

  function applicationStatusHandler(status) {
    // set the activeStatus alongwith the applicationStatus
    setActiveFilter("applicationStatus");
    setApplicationStatus(status);
  }

  if (loadingMyJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;
  }

  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold mb-4 mt-4">
        Total Jobs: {myJobsData?.length}
      </span>

      <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row pb-4">
        <StatusCard
          status="Open"
          count={openJobsCount}
          bgColor="bg-gray-300"
          textColor="text-black"
          hoverColor="hover:bg-gray-400"
          outlineColor="outline-gray-300"
          isSelected={jobStatus === "open" && activeFilter === "jobStatus"}
          onClick={() => jobStatusHandler("open")}
        />
        <StatusCard
          status="Closed"
          count={closedJobsCount}
          bgColor="bg-red-500"
          textColor="text-white"
          hoverColor="hover:bg-red-600"
          outlineColor="outline-red-500"
          isSelected={jobStatus === "closed" && activeFilter === "jobStatus"}
          onClick={() => jobStatusHandler("closed")}
        />
        <StatusCard
          status="In-Progress"
          count={inProgressCount}
          bgColor="bg-blue-500"
          textColor="text-white"
          hoverColor="hover:bg-blue-600"
          outlineColor="outline-blue-500"
          isSelected={
            applicationStatus === "in-progress" &&
            activeFilter === "applicationStatus"
          }
          onClick={() => applicationStatusHandler("in-progress")}
        />
        <StatusCard
          status="Filled"
          count={filledCount}
          bgColor="bg-green-500"
          textColor="text-white"
          hoverColor="hover:bg-green-600"
          outlineColor="outline-green-500"
          isSelected={
            applicationStatus === "filled" &&
            activeFilter === "applicationStatus"
          }
          onClick={() => applicationStatusHandler("filled")}
        />
      </div>

      <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs?.length > 0 ? (
          filteredJobs?.map((myJob, index) => (
            <JobCard key={index} job={myJob} onSaveJob={fnGetMyJobs} isMyJob />
          ))
        ) : (
          <div>No Jobs yet. 👀</div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
