import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { getApplications } from "../api/apiApplications";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreatedApplications = () => {
  const { user, isLoaded } = useUser();

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

  if (loadingApplications) {
    return <BarLoader className="mt-4" width={"100%"} color="#7b68ee" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applicationsData?.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          isCandidate
        />
      ))}
    </div>
  );
};

export default CreatedApplications;
