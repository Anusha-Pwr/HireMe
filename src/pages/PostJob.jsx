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
import AddCompanyDrawer from "../components/AddCompanyDrawer";

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

  const {
    loading: loadingAddJob,
    error: addJobError,
    data: addJobData,
    fn: fnAddNewJob,
  } = useFetch(addNewJob);

  useEffect(() => {
    if (addJobData?.length > 0) {
      navigate("/jobs");
    }
  }, [loadingAddJob]);

  function onSubmitHandler(data) {
    fnAddNewJob({
      ...data,
      recruiter_id: user?.id,
      isOpen: true,
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

      <form
        className="flex flex-col gap-4 p-4 pb-0"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Input type="text" placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
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
          </div>

          <AddCompanyDrawer fetchCompanies={fnGetCompanies} className="w-full sm:w-auto" />
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
        {loadingAddJob && (
          <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />
        )}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;

// import React, { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Input } from "../components/ui/input";
// import { Textarea } from "../components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { State } from "country-state-city";
// import useFetch from "../hooks/useFetch";
// import { getCompanies } from "../api/apiCompanies";
// import { useUser } from "@clerk/clerk-react";
// import { BarLoader } from "react-spinners";
// import { Navigate, useNavigate } from "react-router-dom";
// import MDEditor from "@uiw/react-md-editor";
// import { Button } from "../components/ui/button";
// import { addNewJob } from "../api/apiJobs";
// import AddCompanyDrawer from "../components/AddCompanyDrawer";

// const schema = z.object({
//   title: z.string().min(1, { message: "Title is required." }),
//   description: z.string().min(1, { message: "Description is required." }), // CHANGE: Fixed typo in error message
//   location: z.string().min(1, { message: "Select a location." }),
//   company_id: z.string().min(1, { message: "Select or add a new company." }),
//   requirements: z.string().min(1, { message: "Requirements are required." }),
// });

// const PostJob = () => {
//   const {
//     register,
//     formState: { errors },
//     control,
//     handleSubmit,
//     reset,
//   } = useForm({
//     resolver: zodResolver(schema),
//   });

//   const { user, isLoaded } = useUser();
//   const navigate = useNavigate();

//   if (user?.unsafeMetadata?.role !== "recruiter") {
//     return <Navigate to="/jobs" />;
//   }

//   const {
//     loading: loadingCompanies,
//     error,
//     data: companiesData,
//     fn: fnGetCompanies,
//   } = useFetch(getCompanies);

//   useEffect(() => {
//     if (isLoaded) {
//       fnGetCompanies();
//     }
//   }, [isLoaded]);

//   const {
//     loading: loadingAddJob,
//     error: addJobError,
//     data: addJobData,
//     fn: fnAddNewJob
//   } = useFetch(addNewJob);

//   useEffect(() => {
//     if (addJobData?.length > 0) {
//       navigate("/jobs");
//     }
//   }, [loadingAddJob]);

//   function onSubmitHandler(data) {
//     fnAddNewJob({
//       ...data,
//       recruiter_id: user?.id,
//       isOpen: true
//     });
//   }

//   if (!isLoaded || loadingCompanies) {
//     return <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />;
//   }

//   return (
// CHANGE: Added container class for better spacing on larger screens
// <div className="container mx-auto px-4">
//   {/* CHANGE: Adjusted text size for better responsiveness */}
//   <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center pb-8">
//     Post a Job
//   </h1>

//   {/* CHANGE: Added space-y-6 for consistent vertical spacing between form elements */}
//   <form className="space-y-6" onSubmit={handleSubmit(onSubmitHandler)}>
//     {/* CHANGE: Wrapped each input in a div with space-y-2 for consistent error message spacing */}
//     <div className="space-y-2">
//       {/* CHANGE: Added w-full class to ensure full width on all screen sizes */}
//       <Input type="text" placeholder="Job Title" {...register("title")} className="w-full" />
//       {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//     </div>

//     <div className="space-y-2">
//       <Textarea placeholder="Job Description" {...register("description")} className="w-full" />
//       {errors.description && (
//         <p className="text-red-500 text-sm">{errors.description.message}</p>
//       )}
//     </div>

//     {/* CHANGE: Wrapped selects in a grid for better layout on larger screens */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//       <div className="space-y-2">
//         <Controller
//           name="location"
//           control={control}
//           render={({ field }) => (
//             <Select onValueChange={field.onChange} {...field}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Filter by Location" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   {State.getStatesOfCountry("IN").map(({ name }) => (
//                     <SelectItem value={name} key={name}>
//                       {name}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           )}
//         />
//         {errors.location && (
//           <p className="text-red-500 text-sm">{errors.location.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Controller
//           name="company_id"
//           control={control}
//           render={({ field }) => (
//             <Select onValueChange={field.onChange} {...field}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Filter by Company">
//                   {field.value &&
//                     companiesData?.find(
//                       (company) => company.id === Number(field.value)
//                     )?.name}
//                 </SelectValue>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   {companiesData?.map(({ name, id }) => (
//                     <SelectItem value={id.toString()} key={name}>
//                       {name}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           )}
//         />
//         {errors.company_id && (
//           <p className="text-red-500 text-sm">{errors.company_id.message}</p>
//         )}
//       </div>
//     </div>

//     {/* CHANGE: Moved AddCompanyDrawer outside of the grid for better mobile layout */}
//     <AddCompanyDrawer fetchCompanies={fnGetCompanies} />

//     <div className="space-y-2">
//       <Controller
//         name="requirements"
//         control={control}
//         render={({ field }) => (
//           // CHANGE: Added custom styles to make MDEditor more compact on mobile
//           <MDEditor
//             {...field}
//             preview="edit"
//             className="w-full"
//             height={200}
//             toolbarHeight={40}
//             textareaProps={{
//               placeholder: "Job Requirements (Markdown supported)"
//             }}
//           />
//         )}
//       />
//       {errors.requirements && (
//         <p className="text-red-500 text-sm">{errors.requirements.message}</p>
//       )}
//     </div>

//     {addJobError && <p className="text-red-500 text-sm">{addJobError?.message}</p>}
//     {loadingAddJob && <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />}

//     {/* CHANGE: Made submit button full width and added more vertical padding */}
//     <Button type="submit" variant="blue" size="lg" className="w-full py-6">
//       Submit
//     </Button>
//   </form>
// </div>

// <div className="container mx-auto px-4">
//   <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center pb-8">
//     Post a Job
//   </h1>

//   <form className="space-y-6" onSubmit={handleSubmit(onSubmitHandler)}>
//     <div className="space-y-2">
//       <Input type="text" placeholder="Job Title" {...register("title")} className="w-full" />
//       {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//     </div>

//     <div className="space-y-2">
//       <Textarea placeholder="Job Description" {...register("description")} className="w-full" />
//       {errors.description && (
//         <p className="text-red-500 text-sm">{errors.description.message}</p>
//       )}
//     </div>

//     {/* CHANGE: Modified grid structure for responsive layout */}
//     <div className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
//         <div className="space-y-2">
//           <Controller
//             name="location"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} {...field}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Filter by Location" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     {State.getStatesOfCountry("IN").map(({ name }) => (
//                       <SelectItem value={name} key={name}>
//                         {name}
//                       </SelectItem>
//                     ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             )}
//           />
//           {errors.location && (
//             <p className="text-red-500 text-sm">{errors.location.message}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <Controller
//             name="company_id"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} {...field}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Filter by Company">
//                     {field.value &&
//                       companiesData?.find(
//                         (company) => company.id === Number(field.value)
//                       )?.name}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     {companiesData?.map(({ name, id }) => (
//                       <SelectItem value={id.toString()} key={name}>
//                         {name}
//                       </SelectItem>
//                     ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             )}
//           />
//           {errors.company_id && (
//             <p className="text-red-500 text-sm">{errors.company_id.message}</p>
//           )}
//         </div>
//       </div>

//       {/* CHANGE: AddCompanyDrawer is now part of the flex container */}
//       <AddCompanyDrawer fetchCompanies={fnGetCompanies} />
//     </div>

//     <div className="space-y-2">
//       <Controller
//         name="requirements"
//         control={control}
//         render={({ field }) => (
//           <MDEditor
//             {...field}
//             preview="edit"
//             className="w-full"
//             height={200}
//             toolbarHeight={40}
//             textareaProps={{
//               placeholder: "Job Requirements (Markdown supported)"
//             }}
//           />
//         )}
//       />
//       {errors.requirements && (
//         <p className="text-red-500 text-sm">{errors.requirements.message}</p>
//       )}
//     </div>

//     {addJobError && <p className="text-red-500 text-sm">{addJobError?.message}</p>}
//     {loadingAddJob && <BarLoader className="mb-4" width={"100%"} color="#7b68ee" />}

//     <Button type="submit" variant="blue" size="lg" className="w-full py-6">
//       Submit
//     </Button>
//   </form>
// </div>
//   );
// };

// export default PostJob;
