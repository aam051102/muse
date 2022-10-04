const API_URL =
    window.location.hostname === "localhost"
        ? `http://localhost:4000`
        : `https://ahlgreen.net`;

export { API_URL };
