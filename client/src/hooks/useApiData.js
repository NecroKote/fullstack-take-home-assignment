import useApiHost from './useApiHost';
import { useData } from './useData';

export const useApiData = (uri, autoload, refresh) => {
  const apiHost = useApiHost();
  return useData({
    url: uri ? `${apiHost}/${uri}` : null,
    options: { mode: 'cors' },
    autoload, refresh,
  });
}

export default useApiData;