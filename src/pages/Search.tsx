import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import ParameterRange from "../components/ParameterRange";
import useToken from "../hooks/useToken";

const Search: React.FC = () => {
    const token = useToken();

    const [recommendations, setRecommendations] = useState<
        | {
              name: string;
              id: string;
              artists: { name: string; id: string }[];
          }[]
        | undefined
    >();

    const [categories, setCategories] = useState<
        { name: string; id: string }[] | undefined
    >();

    const [params, setParams] = useState<{
        loudness: { min: number; max: number };
    }>({ loudness: { min: -30, max: -15 } });

    // Fetch recommendations
    const fetchRecommendations = useCallback(async () => {
        if (!token) return;
        const recommendationsParams = new URLSearchParams({
            seed_artists: "",
            seed_genres: "classical",
            seed_tracks: "",
            min_loudness: params.loudness.min.toString(),
            max_loudness: params.loudness.max.toString(),
        });

        const recommendationsRes = await fetch(
            `https://api.spotify.com/v1/recommendations?${recommendationsParams.toString()}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .catch((e) => {
                console.error(e);
                return undefined;
            });

        if (recommendationsRes) {
            setRecommendations(recommendationsRes.tracks);
        }
    }, [token, params]);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    // Fetch categories
    useEffect(() => {
        if (!token) return;

        (async () => {
            const categoriesRes = await fetch(
                `https://api.spotify.com/v1/browse/categories`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((res) => res.json())
                .catch((e) => {
                    console.error(e);
                    return undefined;
                });

            if (categoriesRes) {
                setCategories(categoriesRes.categories.items);
            }
        })();
    }, [token]);

    return (
        <Layout>
            <div className="flex gap-5 justify-between flex-wrap">
                <div className="max-w-[60%] w-full">
                    <h2 className="text-xl">Tracks</h2>

                    <div className="flex flex-col gap-5 mt-5">
                        {recommendations?.map((recommendation) => (
                            <div
                                className="p-2.5 border border-white rounded-sm-card"
                                key={recommendation.id}
                            >
                                <p>{recommendation.name}</p>
                                <p className="text-[14px] text-[#BBBBBB]">
                                    {recommendation.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-[30%] w-full sticky top-5">
                    <h2 className="text-xl">Parameters</h2>

                    <ParameterRange
                        name="Loudness"
                        min={-60}
                        max={0}
                        value={params.loudness}
                        onChange={(value) =>
                            setParams((thisParams) => ({
                                ...thisParams,
                                loudness: value,
                            }))
                        }
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Search;
