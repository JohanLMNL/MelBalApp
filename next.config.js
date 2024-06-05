const nextConfig = {
  webpack: (config, { isServer }) => {
    // Désactive le cache de Webpack
    config.cache = false;

    // Autres configurations Webpack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
