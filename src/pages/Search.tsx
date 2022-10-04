import React, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "../components/Layout";
import ParameterMultiselect from "../components/ParameterMultiselect";
import ParameterRange from "../components/ParameterRange";
import useToken from "../hooks/useToken";

const Search: React.FC = () => {
    const token = useToken();

    const [recommendations, setRecommendations] = useState<
        | {
              name: string;
              id: string;
              external_urls: {
                  spotify: string;
              };
              artists: { name: string; id: string }[];
              album: {
                  name: string;
                  images: { url: string }[];
              };
          }[]
        | undefined
    >();

    const [categories, setCategories] = useState<string[]>([]);

    const [params, setParams] = useState<{
        loudness: { min: number; max: number };
        danceability: { min: number; max: number };
        acousticness: { min: number; max: number };
        instrumentalness: { min: number; max: number };
        liveness: { min: number; max: number };
        speechiness: { min: number; max: number };
        valence: { min: number; max: number };
        key: { min: number; max: number };
        tempo: { min: number; max: number };
        mode: { min: number; max: number };
        energy: { min: number; max: number };
        popularity: { min: number; max: number };
        category: string[];
    }>({
        loudness: { min: -60, max: 0 },
        danceability: { min: 0, max: 1 },
        acousticness: { min: 0, max: 1 },
        instrumentalness: { min: 0, max: 1 },
        liveness: { min: 0, max: 1 },
        speechiness: { min: 0, max: 1 },
        valence: { min: 0, max: 1 },
        key: { min: 0, max: 11 },
        tempo: { min: 0, max: 200 },
        mode: { min: 0, max: 1 },
        energy: { min: 0, max: 1 },
        popularity: { min: 0, max: 100 },
        category: [],
    });

    // Fetch recommendations
    const recommendationCallTimeRef = useRef<number>(0);

    const fetchRecommendations = useCallback(async () => {
        if (!token) return;
        if (params.category.length === 0) return;

        const currentCallTime = new Date().getTime();
        recommendationCallTimeRef.current = currentCallTime;

        const recommendationsParams = new URLSearchParams({
            seed_artists: "",
            seed_genres: params.category.join(","),
            seed_tracks: "",

            min_loudness: params.loudness.min.toString(),
            max_loudness: params.loudness.max.toString(),

            min_danceability: params.danceability.min.toString(),
            max_danceability: params.danceability.max.toString(),

            min_acousticness: params.acousticness.min.toString(),
            max_acousticness: params.acousticness.max.toString(),

            min_instrumentalness: params.instrumentalness.min.toString(),
            max_instrumentalness: params.instrumentalness.max.toString(),

            min_liveness: params.liveness.min.toString(),
            max_liveness: params.liveness.max.toString(),

            min_speechiness: params.speechiness.min.toString(),
            max_speechiness: params.speechiness.max.toString(),

            min_valence: params.valence.min.toString(),
            max_valence: params.valence.max.toString(),

            min_key: params.key.min.toString(),
            max_key: params.key.max.toString(),

            min_tempo: params.tempo.min.toString(),
            max_tempo: params.tempo.max.toString(),

            min_mode: params.mode.min.toString(),
            max_mode: params.mode.max.toString(),

            min_energy: params.energy.min.toString(),
            max_energy: params.energy.max.toString(),

            min_popularity: params.popularity.min.toString(),
            max_popularity: params.popularity.max.toString(),
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

        if (!recommendationsRes) return;
        if (!recommendationsRes.error) {
            if (recommendationCallTimeRef.current !== currentCallTime) return;
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
                `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
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
            if (!categoriesRes) return;
            if (!categoriesRes.error) {
                setCategories(categoriesRes.genres);
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
                            <a
                                href={recommendation.external_urls.spotify}
                                key={recommendation.id}
                            >
                                <article className="p-2.5  border border-white rounded-sm-card flex gap-2.5 hover:border-primary hover:shadow-glow">
                                    <img
                                        className="rounded-sm-card object-cover w-24 h-24 flex-shrink-0"
                                        src={recommendation.album.images[1].url}
                                        alt={recommendation.album.name}
                                    />

                                    <div className="flex flex-col justify-center">
                                        <p>{recommendation.name}</p>
                                        <p className="text-[14px] text-[#BBBBBB]">
                                            {recommendation.artists
                                                .map((artist) => artist.name)
                                                .join(", ")}
                                        </p>
                                    </div>
                                </article>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="max-w-[30%] w-full sticky top-5">
                    <h2 className="text-xl">Parameters</h2>

                    <div className="flex flex-col gap-5 mt-5">
                        <ParameterMultiselect
                            name="Genres"
                            items={categories?.map((category) => ({
                                label: category,
                                value: category,
                            }))}
                            value={params.category}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    category: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Loudness"
                            min={-60}
                            max={0}
                            step={0.5}
                            value={params.loudness}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    loudness: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Danceability"
                            value={params.danceability}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    danceability: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="acousticness"
                            value={params.acousticness}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    acousticness: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Instrumentalness"
                            value={params.instrumentalness}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    instrumentalness: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Liveness"
                            value={params.liveness}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    liveness: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Speechiness"
                            value={params.speechiness}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    speechiness: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Valence"
                            value={params.valence}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    valence: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Key"
                            min={0}
                            max={11}
                            value={params.key}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    key: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Tempo"
                            value={params.tempo}
                            min={0}
                            max={200}
                            step={1}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    tempo: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Mode"
                            value={params.mode}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    mode: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Energy"
                            value={params.energy}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    energy: value,
                                }))
                            }
                        />

                        <ParameterRange
                            name="Popularity"
                            min={0}
                            max={100}
                            step={1}
                            value={params.popularity}
                            onChange={(value) =>
                                setParams((thisParams) => ({
                                    ...thisParams,
                                    popularity: value,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Search;
