import React from "react";

const Home = () => {
    return (
        <div className="bg-back min-h-screen flex items-center justify-center p-5">
            <div className="flex flex-col justify-center items-center w-full gap-20">
                <img
                    src="/logo.svg"
                    alt="MUSE Logo"
                    className="w-full max-w-[220px]"
                />

                <a href="/login" className="std-button">
                    Connect with Spotify
                </a>
            </div>
        </div>
    );
};

export default Home;
