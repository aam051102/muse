import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useToken = (): string | null => {
    let [searchParams] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const thisToken =
            searchParams.get("token") || localStorage.getItem("spotifyToken");
        if (!thisToken || thisToken === token) return;
        localStorage.setItem("spotifyToken", thisToken);
        setToken(thisToken);
    }, [searchParams, token]);

    return token;
};

export default useToken;
