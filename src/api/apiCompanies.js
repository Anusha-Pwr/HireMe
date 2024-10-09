import supabaseClient, { supabaseUrl } from "../utils/supabase";

// function to get the companies data from "companies" supabase table
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching companies: ", error);
    return null;
  }

  return data;
}

// function to insert new company to "companies" supabase table
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const companyName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase
    .from("company-logo")
    .upload(companyName, companyData.logo);

  if (storageError) {
    console.error("Error uploading company logo: ", storageError);
    return null;
  }

  const logoUrl = `${supabaseUrl}/storage/v1/object/public/company-logo/${companyName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        ...companyData,
        logo_url: logoUrl,
      },
    ])
    .select();

  if (error) {
    console.error("Error adding new company: ", error);
    return null;
  }

  return data;
}
