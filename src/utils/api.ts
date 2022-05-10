import Axios from "axios";
import useSWR from "swr";

const api = Axios.create({
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// @ts-ignore
const fetcher = (url: string) => api.get(url).then((response) => response.data);

export const useGetter = (
  url: string,
  shouldFetch: boolean,
): {
  data: any;
  mutate: any;
  error: any;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, mutate, error } = useSWR(shouldFetch ? url : null, fetcher);
  return { data, mutate, error, isLoading: !data && !error, isError: !!error };
};

export default api;
