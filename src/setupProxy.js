const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 从环境变量读取后端 API 地址，默认为 http://localhost:8000
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  console.log(`[Proxy] API requests will be proxied to: ${apiBaseUrl}`);

  app.use(
    '/api',
    createProxyMiddleware({
      target: apiBaseUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      onError: (err, req, res) => {
        console.error('[Proxy Error]', err.message);
      },
    })
  );
};
