/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'img.vietqr.io' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  // Dev-only: lets the dev server (HMR, Server Actions, static assets) be
  // reached through a localtunnel tunnel for QA on other devices. loca.lt
  // assigns a new random subdomain per session, hence the wildcard.
  allowedDevOrigins: ['*.loca.lt'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.loca.lt'],
    },
  },
};

export default nextConfig;
