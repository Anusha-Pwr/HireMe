import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const OnBoarding = () => {
  const { user, isLoaded } = useUser();
  // console.log(user);

  const navigate = useNavigate();

  useEffect(() => {
    if(user?.unsafeMetadata?.role) {
        navigate(user?.unsafeMetadata?.role==="recruiter" ? "/post-job" : "/jobs");
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;
  }

  async function roleSelectionHandler(role) {
    try {
      await user.update({
        unsafeMetadata: { role },
      });

      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    } catch (err) {
      console.log("Error updating role:", err);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-32">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-8 w-full md:px-40">
        <Button
          variant="blue"
          className="h-20 sm:h-32 md:h-36 text-xl md:text-2xl"
          onClick={() => roleSelectionHandler("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="purple"
          className="h-20 sm:h-32 md:h-36 text-xl md:text-2xl"
          onClick={() => roleSelectionHandler("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default OnBoarding;
