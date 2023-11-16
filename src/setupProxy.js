const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "ws",
    createProxyMiddleware({
      target: "https://13.124.120.175",
      ws: true,
    })
  );
};
