/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "misc.scdn.co",
      "i.scdn.co",
      "geo-media.beatsource.com",
      "i1.sndcdn.com",
      "media.pitchfork.com",
      "seed-mix-image.spotifycdn.com",
      "kiatgcrzkstwssoqhyuc.supabase.co",
    ],
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
