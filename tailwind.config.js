/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                back: "#020104",
                primary: "#0B4BF0",
                "primary-dark": "#0B2Bd0",
            },
            borderRadius: {
                "sm-card": "5px"
            },
            boxShadow: {
                "glow": "0 0 25px 0px #0b4bf090"
            }
        },
    },
    plugins: [],
};
