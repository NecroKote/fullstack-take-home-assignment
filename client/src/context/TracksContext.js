import { useState, createContext, useEffect, useCallback } from 'react';
import useApiHost from '../hooks/useApiHost';

export const TracksContext = createContext();

export const TracksContextProvider = ({ children }) => {
    const apiHost = useApiHost();

    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const refresh = useCallback(() => {
        setIsLoading(true);
        return fetch(`${apiHost}/tracks/`, { mode: "cors" })
            .then((res) => res.json())
            .then(setTracks)
            .then(() => setIsLoading(false))
            .catch((err) => {
                setIsLoading(false);
                setErrorMsg(err.message)
            })
    }, [apiHost]);

    useEffect(() => {
        refresh()
    }, [refresh]);

    const exposed = {
        tracks,
        isLoading,
        errorMsg,
        refresh,
    }

    return (
        <TracksContext.Provider value={exposed}>
            {children}
        </TracksContext.Provider>
    );
};
