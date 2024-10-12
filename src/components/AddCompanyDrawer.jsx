import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "../hooks/useFetch";
import { addNewCompany } from "../api/apiCompanies";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  logo_url: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only images are allowed." }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    data: addCompanyData,
    error: errorAddCompany,
    loading: loadingAddCompany,
    fn: fnAddNewCompany,
  } = useFetch(addNewCompany);

  useEffect(() => {
    if (addCompanyData?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  function onSubmitHandler(data) {
    fnAddNewCompany({
      ...data,
      logo_url: data.logo_url[0],
    });
  }

  return (
    <Drawer>
      <DrawerTrigger>
          <Button type="button" variant="secondary" size="sm">
            Add Company
          </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex gap-2 p-4 pb-0">
          <Input type="text" placeholder="Company Name" {...register("name")} />
          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register("logo_url")}
          />
          <Button
            type="button"
            variant="destructive"
            className="w-40"
            onClick={handleSubmit(onSubmitHandler)}
          >
            Add
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo_url && (
          <p className="text-red-500">{errors.logo_url.message}</p>
        )}

        {errorAddCompany && (
          <p className="text-red-500">{errorAddCompany?.message}</p>
        )}
        {loadingAddCompany && (
          <BarLoader className="mt-4" width={"100%"} color="#7b68ee" />
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
