const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "job-board-storage.s3.us-east-005.backblazeb2.com",
      },
    ],
  },
};

export default nextConfig;