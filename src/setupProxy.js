const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "ws",
    createProxyMiddleware({
      target: "https://knu-rideshare.site:8080/",
      ws: true,
    })
  );
};
