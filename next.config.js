/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "climingo-api.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
