import supabaseClient from "../utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = await supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url), saved: saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`); // case insensitive search in the 'title' column
  }

  const { data, error } = query;

  if (error) {
    console.log("Error fetching jobs:", error);
    return null;
  }

  return data;
}

export async function saveJob(token, alreadySaved, saveJobData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveJobData.job_id);

    if (deleteError) {
      console.error("Error removing saved job: ", deleteError);
      return null;
    }

    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveJobData])
      .select();

    if (insertError) {
      console.error("Error inserting saved job: ", insertError);
      return null;
    }

    return data;
  }
}
