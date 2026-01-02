/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable static page generation for dashboard routes
    // to prevent build-time Firebase initialization issues
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

module.exports = nextConfig;
