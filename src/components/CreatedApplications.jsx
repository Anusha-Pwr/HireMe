import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { getApplications } from "../api/apiApplications";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";
import ApplicationStatusCard from "./ApplicationStatusCard";

const CreatedApplications = () => {
  const { user, isLoaded } = useUser();

  const [selectedStatus, setSelectedStatus] = useState("All");

  const {
    loading: loadingApplications,
    data: applicationsData,
    error,
    fn: fnGetApplications,
  } = useFetch(getApplications, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) {
      fnGetApplications();
    }
  }, [isLoaded]);

  const filteredApplications =
    selectedStatus === "All"
      ? applicationsData
      : applicationsData?.filter(
          (application) => application.status === selectedStatus
        );

  const appliedCount = applicationsData?.filter(
    (application) => application.status === "applied"
  ).length;
  const interviewingCount = applicationsData?.filter(
    (application) => application.status === "interviewing"
  ).length;
  const hiredCount = applicationsData?.filter(
    (application) => application.status === "hired"
  ).length;
  const rejectedCount = applicationsData?.filter(
    (application) => application.status === "rejected"
  ).length;

  if (loadingApplications) {
    return <BarLoader className="mt-4" width={"100%"} color="#7b68ee" />;
  }

  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold mb-4 mt-4">
        Total Applications: {applicationsData?.length}
      </span>

      <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row pb-4">
        <ApplicationStatusCard
          status="Applied"
          count={appliedCount}
          bgColor="bg-gray-300"
          textColor="text-black"
          hoverColor="hover:bg-gray-400"
          outlineColor="outline-gray-300"
          isSelected={selectedStatus === "applied"}
          onClick={() => setSelectedStatus("applied")}
        />
        <ApplicationStatusCard
          status="Interviewing"
          count={interviewingCount}
          bgColor="bg-blue-500"
          textColor="text-white"
          hoverColor="hover:bg-blue-600"
          outlineColor="outline-blue-500"
          isSelected={selectedStatus === "interviewing"}
          onClick={() => setSelectedStatus("interviewing")}
        />
        <ApplicationStatusCard
          status="Hired"
          count={hiredCount}
          bgColor="bg-green-500"
          textColor="text-white"
          hoverColor="hover:bg-green-600"
          outlineColor="outline-green-500"
          isSelected={selectedStatus === "hired"}
          onClick={() => setSelectedStatus("hired")}
        />
        <ApplicationStatusCard
          status="Rejected"
          count={rejectedCount}
          bgColor="bg-red-500"
          textColor="text-white"
          hoverColor="hover:bg-red-600"
          outlineColor="outline-red-500"
          isSelected={selectedStatus === "rejected"}
          onClick={() => setSelectedStatus("rejected")}
        />
      </div>

      <div className="flex flex-col gap-2">
        {filteredApplications?.length > 0 ? (
          filteredApplications?.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              isCandidate
            />
          ))
        ) : (
          <div>No Applications yet. 👀</div>
        )}
      </div>
    </div>
  );
};

export default CreatedApplications;
