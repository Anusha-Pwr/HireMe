import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import useFetch from "../hooks/useFetch";
import { getCompanies } from "../api/apiCompanies";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "../components/ui/button";
import { addNewJob } from "../api/apiJobs";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Title is required." }),
  location: z.string().min(1, { message: "Select a location." }),
  company_id: z.string().min(1, { message: "Select or add a new company." }),
  requirements: z.string().min(1, { message: "Requirements are required." }),
});

const PostJob = () => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { user, isLoaded } = useUser();

  const navigate = useNavigate();

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  const {
    loading: loadingCompanies,
    error,
    data: companiesData,
    fn: fnGetCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnGetCompanies();
    }
  }, [isLoaded]);

  const {loading: loadingAddJob, error: addJobError, data: addJobData, fn: fnAddNewJob} = useFetch(addNewJob);

  useEffect(() => {
    if(addJobData?.length > 0) {
      navigate("/jobs");
    }
  }, [loadingAddJob]);

  function onSubmitHandler(data) {
    fnAddNewJob({
      ...data,
      recruiter_id: user?.id,
      isOpen: true
    });
  }

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>

      <form className="flex flex-col gap-4 p-4 pb-0" onSubmit={handleSubmit(onSubmitHandler)}>
        <Input type="text" placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} {...field}>
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
            )}
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} {...field}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Company">
                    {field.value &&
                      companiesData?.find(
                        (company) => company.id === Number(field.value)
                      )?.name}
                  </SelectValue>
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
            )}
          />
          {errors.company_id && (
            <p className="text-red-500">{errors.company_id.message}</p>
          )}
        </div>

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor onChange={field.onChange} value={field.value} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {addJobError && <p className="text-red-500">{addJobError?.message}</p>}
        {loadingAddJob && <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
