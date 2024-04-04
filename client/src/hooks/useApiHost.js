const apiHost = process.env.API_HOST || "http://localhost:8000"

export const useApiHost = () => apiHost;
export default useApiHost;
