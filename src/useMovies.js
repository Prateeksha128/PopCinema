import { useEffect, useState } from "react";

const key = "9e17f9f";


export function useMovies(query,callBack) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
      const controller = new AbortController();
      callBack?.();

    async function movieFetch() {
      try {
        setIsLoading(true);
        setError("");
        // console.log(query);

        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error();
        }
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found :(");
        setMovies(data.Search);
        setError("");
        // console.log(data);
      } catch (err) {
        console.log(err.message);
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    movieFetch();
    return function () {
      controller.abort();
    };
  }, [query]);
    return {movies, isLoading, error}
}
