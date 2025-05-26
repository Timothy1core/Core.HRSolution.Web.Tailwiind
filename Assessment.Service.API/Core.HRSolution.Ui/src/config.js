const config = {
    API_URL: import.meta.env.MODE === 'development'
    ? 'https://localhost:5000'
    : 'https://172.16.254.4/services/gateway'
};

export default config; // Make sure `export default` is used here
