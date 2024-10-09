import supabaseClient, { supabaseUrl } from "../utils/supabase";

export async function applyToJob(token, _, candidateData) {
  // function to submit the application data to supabase "applications" table
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${candidateData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, candidateData.resume);

  if (storageError) {
    console.log("error here");
    console.log("Error uploading resume: ", storageError);
    return null;
  }

  const resumeUrl = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...candidateData,
        resume: resumeUrl,
      },
    ])
    .select();

  if (error) {
    console.log("Error submitting application: ", error);
    return null;
  }

  return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error updating application status: ", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .select("*, job: jobs(title, company: companies(name))")
    .eq("candidate_id", user_id);

  if(error) {
    console.error("Error fetching applications: ", error);
    return null;
  }

  return data;
}
