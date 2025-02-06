import { useEffect } from 'react';

const usePageReloadOnBack = () => {
  useEffect(() => {
    const handlePopState = () => {

      window.location.reload(true);
    };

  
    window.addEventListener('popstate', handlePopState);


    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); 
};

export default usePageReloadOnBack;
