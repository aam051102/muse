import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    // Redirect if token is defined
    /*const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("spotifyToken");
        if (!token) return;
        navigate("/search");
    }, [navigate]);*/

    return (
        <div className="bg-back min-h-screen flex items-center justify-center p-5">
            <div className="flex flex-col justify-center items-center w-full gap-20">
                <img
                    src={`${process.env.PUBLIC_URL}/logo.svg`}
                    alt="MUSE Logo"
                    className="w-full max-w-[220px]"
                />

                <Link to="/auth/login" reloadDocument className="std-button">
                    Connect with Spotify
                </Link>
            </div>
        </div>
    );
};

export default Home;
