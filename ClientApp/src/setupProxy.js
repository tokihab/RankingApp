const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:63653';

const context = [
    "/item",
    "/api/tierlist",
    "/api/item"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: target,
        secure: false,
        headers: {
            Connection: 'Keep-Alive'
        }
    });

    // Proxy uploads directly to MAMP
    const uploadsProxy = createProxyMiddleware('/api/item/uploads', {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
    });

    app.use(appProxy);
    app.use(uploadsProxy);
};