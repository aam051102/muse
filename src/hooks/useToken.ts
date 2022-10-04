import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../util";

const useToken = (): string | null => {
    let [searchParams] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [expiry, setExpiry] = useState<number | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const fetchToken = useCallback(async () => {
        if (!refreshToken) return;

        const refreshTokenRes = await fetch(
            `${API_URL}/app/muse/auth/refresh_token?refresh_token=${refreshToken}`
        )
            .then((res) => res.json())
            .catch((e) => {
                console.error(e);
                return undefined;
            });
        if (!refreshTokenRes) return;

        setToken(refreshTokenRes.token);
        localStorage.setItem("spotifyTokenExpiry", refreshTokenRes.expiry);
        setExpiry(refreshTokenRes.expiry);
    }, [refreshToken]);

    useEffect(() => {
        if (!expiry) return;

        let timeout: NodeJS.Timeout;

        if (new Date().getTime() > expiry - 1000 * 60 * 5) {
            timeout = setTimeout(() => {
                fetchToken();
            }, expiry - 1000 * 60 * 5);
        } else if (new Date().getTime() >= expiry) {
            fetchToken();
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [expiry, fetchToken]);

    useEffect(() => {
        const thisRefreshToken =
            searchParams.get("refreshToken") ??
            localStorage.getItem("spotifyRefreshToken");
        if (thisRefreshToken) {
            localStorage.setItem("spotifyRefreshToken", thisRefreshToken);
            setRefreshToken(thisRefreshToken);
        }

        const thisToken = searchParams.get("token");
        if (thisToken) {
            setToken(thisToken);
        }

        const thisExpiry =
            searchParams.get("expiry") ??
            localStorage.getItem("spotifyTokenExpiry");
        if (thisExpiry) {
            localStorage.setItem("spotifyTokenExpiry", thisExpiry);
            setExpiry(Number(thisExpiry));
        }
    }, [searchParams]);

    useEffect(() => {
        fetchToken();
    }, [fetchToken]);

    return token;
};

export default useToken;
