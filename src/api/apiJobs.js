import supabaseClient from "../utils/supabase";

// function to get the jobs data from "jobs" supabase table, based on the location, company, or searchQuery, if any.
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url), saved: saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    console.log("present");
    console.log(searchQuery);
    query = query.ilike("title", `%${searchQuery}%`); // case insensitive search in the 'title' column
  }

  console.log(query);
  const { data, error } = await query;

  if (error) {
    console.log("Error fetching jobs:", error);
    return null;
  }

  return data;
}

// function to either save a job if it is not already saved or delete it if already saved.
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

    console.log(data);
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

    console.log(data);
    return data;
  }
}

// function to get a job based on job id
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, company: companies(name, logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching job: ", error);
    return null;
  }

  return data;
}

// function to update the hiring status of a job by the recuiter
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error updating hiring status: ", error);
    return null;
  }

  return data;
}

// function to insert a new job created by a recruiter in "jobs" table
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error creating job: ", error);
    return null;
  }

  return data;
}

// function to to get saved jobs of candidate from "saved_jobs" table
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name, logo_url))");

  if (error) {
    console.error("Error fetching saved jobs: ", error);
    return null;
  }

  return data;
}

// function to fetch created jobs of a recruiter based on recruiter_id
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching created jobs: ", error);
    return null;
  }

  return data;
}
