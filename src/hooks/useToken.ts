import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../util";

const useToken = (): string | null => {
    let [searchParams] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [expiry, setExpiry] = useState<string | null>(null);
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
        setExpiry(refreshTokenRes.expiry);
    }, [refreshToken]);

    useEffect(() => {
        if (!expiry) return;

        let timeout: NodeJS.Timeout;
        const closeToExpiry = dayjs(expiry).subtract(5, "minutes");
        const currentDate = dayjs();

        if (currentDate.isBefore(closeToExpiry)) {
            timeout = setTimeout(() => {
                fetchToken();
            }, closeToExpiry.diff(currentDate));
        } else if (currentDate.isAfter(closeToExpiry)) {
            fetchToken();
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [expiry, fetchToken]);

    useEffect(() => {
        if (!token) {
            fetchToken();
        }
    }, [fetchToken, token]);

    useEffect(() => {
        const thisToken = searchParams.get("token");
        const thisExpiry = searchParams.get("expiry");
        if (thisExpiry && thisToken) {
            setToken(thisToken);
            setExpiry(thisExpiry);
        }

        const thisRefreshToken =
            searchParams.get("refreshToken") ??
            localStorage.getItem("spotifyRefreshToken");
        if (thisRefreshToken) {
            localStorage.setItem("spotifyRefreshToken", thisRefreshToken);
            setRefreshToken(thisRefreshToken);
        }
    }, [searchParams]);

    return token;
};

export default useToken;
