import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  enableLoadingRequest: () => {},
  disableLoadingRequest: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const enableLoadingRequest = () => setIsLoading(true);
  const disableLoadingRequest = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, enableLoadingRequest, disableLoadingRequest }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-25">
          <div className="h-12 w-12 border-4 border-t-transparent border-red-500 rounded-full animate-spin" />
          <span className="text-black text-lg font-semibold mt-5">Loading, please wait...</span>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);