import { promisify } from "util";
import { readFile } from "fs";
import webpack from "webpack";

const readFileAsync = promisify(readFile);

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Remove handling of node:buffer scheme
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: false,
      };
    }

    return config;
  },
};

export default nextConfig;
