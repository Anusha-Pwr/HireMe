import supabaseClient from "../utils/supabase";


export async function getJobs(token, {location, company_id, searchQuery}) {
    const supabase = await supabaseClient(token);

    let query = await supabase.from("jobs").select("*");

    if(location) {
        query = query.eq("location", location);
    }

    if(company_id) {
        query = query.eq("company_id", company_id);
    }

    if(searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`); // case insensitive search in the 'title' column
    }

    const {data, error} = await supabase.from("jobs").select("*");

    if(error) {
        console.log("Error fetching jobs:", error);
        return null;
    }

    return data;
}