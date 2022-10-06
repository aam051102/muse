import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="bg-back min-h-screen flex items-center justify-center p-5">
            <div className="flex flex-col justify-center items-center w-full">
                <img
                    src={`${process.env.PUBLIC_URL}/logo.svg`}
                    alt="MUSE Logo"
                    className="w-full max-w-[220px] mb-10"
                />

                <p className="text-white mb-20 max-w-2xl text-center">
                    Note that use of this application requires whitelisting due
                    to Spotify restrictions.
                </p>

                <Link to="/auth/login" reloadDocument className="std-button">
                    Connect with Spotify
                </Link>
            </div>
        </div>
    );
};

export default Home;
