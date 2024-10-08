import supabaseClient, { supabaseUrl } from "../utils/supabase";

export async function applyToJob(token, _, candidateData) {
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
