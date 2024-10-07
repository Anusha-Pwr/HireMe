import { useSession } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session } = useSession();

  async function fn(...args) {
    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });

      const response = await cb(supabaseAccessToken, options, ...args);
      console.log(response);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    fn,
  };
};

export default useFetch;
