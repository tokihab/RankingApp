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
        target: 'http://localhost:80', // MAMP Apache is on port 80
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            // This is the fix: route the request to the new tierapp folder on MAMP
            '^/api/item/uploads': '/tierapp/item/uploads', 
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log('Proxying uploads request to:', proxyReq.path);
        }
    });

    app.use(uploadsProxy);
    app.use(appProxy);
};