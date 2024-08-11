/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
            protocol: 'https',
            hostname: '**.googleusercontent.com', // This matches all subdomains of googleusercontent.com
            port: '', // Leave port empty if not using any specific port
            },
        ],
    },
};

export default nextConfig;
