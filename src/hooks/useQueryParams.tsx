import { useEffect, useState } from "react";

const useQueryParams = () => {
  const [ queryParams, setQueryParams ] = useState(new URLSearchParams(window.location.search));

  const listenToPopstate = () => {
    const params = window.location.search;
    setQueryParams(new URLSearchParams(params));
  };
  
  useEffect(() => {

    window.addEventListener("popstate", listenToPopstate);
    
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, []);

  return queryParams;
};

export default useQueryParams;