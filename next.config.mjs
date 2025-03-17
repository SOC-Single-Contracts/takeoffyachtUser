// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: false,
//     env: {
//         NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
//         NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     },
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'api.takeoffyachts.com',
//           // port: '8000',
//           pathname: '/images/**',
//         },
//       ],
//       unoptimized: true,
//     },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://yachtsmain.netlify.app',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.takeoffyachts.com',
                pathname: '/images/**',
            },
        ],
        unoptimized: true, // Use with caution; Next.js won't optimize images
    },
};

export default nextConfig;
