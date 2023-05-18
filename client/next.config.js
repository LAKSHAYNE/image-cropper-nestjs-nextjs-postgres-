//module.exports = nextConfig
module.exports = async () => {
  const rewrites = () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};
