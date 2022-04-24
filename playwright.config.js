const config = {
    webServer: {
        command: 'npm run serve',
        url: 'http://localhost:3030/',
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
    use: {
        baseURL: 'http://localhost:3030/',
    },
};
export default config;
