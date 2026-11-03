/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/maps', destination: '/map', permanent: false },
      { source: '/disaster', destination: '/disasters', permanent: false },
      { source: '/shelter', destination: '/shelters', permanent: false },
      { source: '/hospital', destination: '/hospitals', permanent: false },
      { source: '/ngo', destination: '/ngos', permanent: false },
      { source: '/volunteer', destination: '/volunteers', permanent: false },
      { source: '/resource', destination: '/resources', permanent: false },
      { source: '/rescue', destination: '/rescue-teams', permanent: false },
      { source: '/team', destination: '/rescue-teams', permanent: false },
      { source: '/teams', destination: '/rescue-teams', permanent: false },
      { source: '/home', destination: '/', permanent: false },
      { source: '/portal', destination: '/', permanent: false },
      { source: '/admin', destination: '/dashboard', permanent: false },
      { source: '/app', destination: '/dashboard', permanent: false },
      { source: '/command', destination: '/dashboard', permanent: false },
      { source: '/help', destination: '/sos/new', permanent: false },
      { source: '/emergency', destination: '/sos/new', permanent: false },
      { source: '/chat', destination: '/ai/assistant', permanent: false },
      { source: '/assistant', destination: '/ai/assistant', permanent: false },
    ];
  },
};

export default nextConfig;
