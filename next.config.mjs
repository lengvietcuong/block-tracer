/** @type {import('next').NextConfig} */

import withPWA from 'next-pwa';

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA({
    dest: 'public',
    skipWaiting: true,
    register: true,
    disable: process.env.NODE_ENV === 'development'
})(nextConfig);